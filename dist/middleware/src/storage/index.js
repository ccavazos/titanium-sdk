'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _storage = require('kinvey-node-sdk/dist/request/src/middleware/src/storage');

var _storage2 = _interopRequireDefault(_storage);

var _utils = require('kinvey-node-sdk/dist/utils');

var _titaniumdb = require('./src/titaniumdb');

var _titaniumdb2 = _interopRequireDefault(_titaniumdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Storage = function (_KinveyStorage) {
  _inherits(Storage, _KinveyStorage);

  function Storage() {
    _classCallCheck(this, Storage);

    return _possibleConstructorReturn(this, (Storage.__proto__ || Object.getPrototypeOf(Storage)).apply(this, arguments));
  }

  _createClass(Storage, [{
    key: 'getAdapter',
    value: function getAdapter() {
      var _this2 = this;

      return _titaniumdb2.default.loadAdapter(this.name).then(function (adapter) {
        if ((0, _utils.isDefined)(adapter) === false) {
          return _get(Storage.prototype.__proto__ || Object.getPrototypeOf(Storage.prototype), 'getAdapter', _this2).call(_this2);
        }

        return adapter;
      });
    }
  }]);

  return Storage;
}(_storage2.default);

exports.default = Storage;