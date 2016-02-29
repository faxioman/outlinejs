'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseLayoutController = exports.BaseController = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //eslint-disable-line no-unused-vars


var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _contexts = require('./contexts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var safeStringifyRegExScript = new RegExp('<\/script', 'g');
var safeStringifyRegExComment = new RegExp('<!--', 'g');

function safeStringify(obj) {
  return JSON.stringify(obj).replace(safeStringifyRegExScript, '<\\/script').replace(safeStringifyRegExComment, '<\\!--');
}

var BaseController = exports.BaseController = function () {
  function BaseController(req, res) {
    _classCallCheck(this, BaseController);

    this._viewInstance = null;
    this.res = res;
    this.req = req;
  }

  _createClass(BaseController, [{
    key: 'getViewForRendering',
    value: function getViewForRendering() {
      return this.view;
    }
  }, {
    key: 'reconcileWithServer',
    value: function reconcileWithServer() {
      if (_contexts.runtime.isClient && window.VIEW_PROPS) {
        this.render(window.VIEW_PROPS);
        window.VIEW_PROPS = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var context = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var View = this.getViewForRendering(); //eslint-disable-line
      if (_contexts.runtime.isClient) {
        this._viewInstance = _reactDom2.default.render(_react2.default.createElement(View, _extends({}, context, { delegate: this })), _contexts.runtime.renderContainerObject);
      } else {
        //render react component
        var html = _contexts.runtime.renderContainerObject.replace(_contexts.runtime.serverRenderContainerPattern, function (match, pre, inside, post) {
          return pre + _server2.default.renderToString(_react2.default.createElement(View, _extends({}, context, { delegate: _this }))) + post;
        });
        //render react component props
        var propScript = _server2.default.renderToStaticMarkup(_react2.default.DOM.script({ dangerouslySetInnerHTML: { __html: 'var VIEW_PROPS = ' + safeStringify(context) + ';'
          } }));
        html = html.replace('<head>', '<head>' + propScript);
        //output to http response
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(html);
      }
    }
  }, {
    key: 'view',
    get: function get() {
      throw 'NotImplemented. The \'view\' property is not implemented!';
    }
  }, {
    key: 'viewInstance',
    get: function get() {
      return this._viewInstance;
    }
  }, {
    key: 'isViewRendered',
    get: function get() {
      return this.viewInstance !== null;
    }
  }], [{
    key: 'loginRequired',
    get: function get() {
      return true;
    }
  }]);

  return BaseController;
}();

var BaseLayoutController = exports.BaseLayoutController = function (_BaseController) {
  _inherits(BaseLayoutController, _BaseController);

  // in base layout view
  // layout view correspond to BaseController view
  // and view correspond to the view to set in content property

  function BaseLayoutController(req, res) {
    _classCallCheck(this, BaseLayoutController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseLayoutController).call(this, req, res));
  }

  _createClass(BaseLayoutController, [{
    key: 'getViewForRendering',
    value: function getViewForRendering() {
      return this.layoutView;
    }
  }, {
    key: 'reconcileWithServer',
    value: function reconcileWithServer() {
      if (_contexts.runtime.isClient && window.VIEW_PROPS) {
        //re-sync server rendered props (content is not a serializable prop ... so is not available in serialized VIEW_PROPS)
        window.VIEW_PROPS.content = this.view;
        _get(Object.getPrototypeOf(BaseLayoutController.prototype), 'render', this).call(this, window.VIEW_PROPS);
        window.VIEW_PROPS = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var context = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var mergedContext = {};
      mergedContext.contentProps = context;
      mergedContext.content = this.view;
      _get(Object.getPrototypeOf(BaseLayoutController.prototype), 'render', this).call(this, mergedContext);
    }
  }, {
    key: 'layoutView',
    get: function get() {
      throw 'NotImplemented. The \'layoutView\' property is not implemented!';
    }
  }]);

  return BaseLayoutController;
}(BaseController);