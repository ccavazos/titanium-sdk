'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _titanium = require('./src/titanium');

var _titanium2 = _interopRequireDefault(_titanium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Http = function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: 'handle',
    value: function handle(request, response) {
      if (!this.adapter) {
        return _es6Promise2.default.reject(new Error('Unable to handle the request. An adapter is not specified.'));
      }

      return this.adapter.handle(request, response);
    }
  }, {
    key: 'adapter',
    get: function get() {
      if (_titanium2.default.isSupported()) {
        return new _titanium2.default();
      }

      return null;
    }
  }]);

  return Http;
}();

exports.default = Http;