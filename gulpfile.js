 /* eslint-disable */
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var git = require('gulp-git');
var gulpif = require('gulp-if');
var prompt = require('gulp-prompt');
var bump = require('gulp-bump');
var browserify = require('browserify');
var babel = require('gulp-babel');
var buffer = require('vinyl-buffer');
var del = require('del');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var semverRegex = require('semver-regex');
var spawn = require('child_process').spawn;

function errorHandler(err) {
  util.log(err.toString());
  this.emit('end');
}

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('clean', function(done) {
  return del(['build', 'dist'], done);
});

gulp.task('build', ['clean', 'lint'], function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build'))
});

gulp.task('bundle', ['build'], function() {
  return browserify({
    debug: false, // turns on/off source mapping
    entries: './build/index.js',
    standalone: 'Kinvey'
  })
    .bundle()
    .pipe(plumber())
    .pipe(source('kinvey.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('kinvey.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .on('error', errorHandler);
});

gulp.task('uploadS3', ['bundle'], function () {
  var packageJSON = require('./package.json');
  var version = packageJSON.version;

  gulp.src([
    'dist/kinvey.js',
    'dist/kinvey.min.js'
  ])
    .pipe(plumber())
    .pipe(gulpif('kinvey.js', rename({ basename: `kinvey-titanium-${version}` })))
    .pipe(gulpif('kinvey.min.js', rename({ basename: `kinvey-titanium-${version}.min` })))
    .pipe(gulp.dest('./sample'));
});

gulp.task('commit', function() {
  return gulp.src('./')
    .pipe(prompt.prompt({
      type: 'input',
      name: 'message',
      message: 'What would you like to say for the commit message?',
      validate: function(message) {
        if (message && message.trim() !== '') {
          return true;
        }

        return false;
      }
    }, function(res) {
      gulp.src('./*')
        .pipe(git.add())
        .pipe(git.commit(res.message));
    }));
});

gulp.task('bump', function() {
  var packageJSON = require('./package.json');
  var version = packageJSON.version;

  return gulp.src('./')
    .pipe(prompt.prompt({
      type: 'input',
      name: 'version',
      message: `The current version is ${version}. What is the new version?`,
      validate: function(version) {
        return semverRegex().test(version);
      }
    }, function(res) {
      gulp.src(['bower.json', 'package.json'])
        .pipe(bump({ version: res.version }))
        .pipe(gulp.dest('./'));
    }));
});

gulp.task('tag', ['bump'], function(done) {
  var packageJSON = require('./package.json');
  var version = packageJSON.version;

  git.tag(version, null, function (err) {
    if (err) {
      errorHandler(err);
    }

    done(err);
  });
});

gulp.task('push', function(done) {
  git.push('origin', 'master', { args: '--follow-tags -f' }, function(error) {
    if (error) {
      errorHandler(error);
    }

    done(error);
  });
});

gulp.task('publish', function(done) {
  spawn('publish', ['publish'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('release', function() {
  runSequence('uploadS3', 'commit', 'tag', ['push', 'publish']);
});

gulp.task('default', function() {
  runSequence('bundle');
});