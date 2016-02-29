'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.BaseRouter = exports.RouteUtils = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.url = url;
exports.include = include;

var _contexts = require('./contexts');

var _crossroads = require('crossroads');

var _crossroads2 = _interopRequireDefault(_crossroads);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stateRouteMapping = {};

var UrlDefinition = function () {
  function UrlDefinition(state, controller) {
    _classCallCheck(this, UrlDefinition);

    this._state = state;
    this._controller = controller;
  }

  _createClass(UrlDefinition, [{
    key: 'state',
    get: function get() {
      return this._state;
    }
  }, {
    key: 'controller',
    get: function get() {
      return this._controller;
    }
  }]);

  return UrlDefinition;
}();

var IncludeDefinition = function () {
  function IncludeDefinition(router) {
    _classCallCheck(this, IncludeDefinition);

    this._router = router;
  }

  _createClass(IncludeDefinition, [{
    key: 'router',
    get: function get() {
      return this._router;
    }
  }]);

  return IncludeDefinition;
}();

function url(state, controller) {
  return new UrlDefinition(state, controller);
}

function include(router) {
  return new IncludeDefinition(router);
}

var RouteUtils = exports.RouteUtils = function () {
  function RouteUtils() {
    _classCallCheck(this, RouteUtils);
  }

  _createClass(RouteUtils, null, [{
    key: 'listen',
    value: function listen(routerClass) {
      new routerClass(); //eslint-disable-line no-unused-vars, new-cap, no-new
      if (_contexts.runtime.isClient) {
        RouteUtils._listenClient();
      } else {
        RouteUtils._listenServer();
      }
    }
  }, {
    key: '_listenServer',
    value: function _listenServer() {
      var http = require('http');
      var urlModule = require('url');
      _crossroads2.default.ignoreState = true;
      _crossroads2.default.bypassed.add(function (req, res) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>HTTP 404 - Page Not Found</h1><hr/><p>OutlineJS Server</p></body></html>');
      });
      http.createServer(function (req, res) {
        var requestedUrl = urlModule.parse(req.url).pathname;
        RouteUtils.parseUrl(requestedUrl, req, res);
      }).listen(1337, '0.0.0.0');
    }
  }, {
    key: '_listenClient',
    value: function _listenClient() {
      require('html5-history-api');
      var location = window.history.location || window.location;
      var eventDef = window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on'];
      window[eventDef[0]](eventDef[1] + 'popstate', function () {
        RouteUtils.parseUrl(location.pathname);
      }, false);
      RouteUtils.parseUrl(location.pathname);
    }
  }, {
    key: 'parseUrl',
    value: function parseUrl(path, req, res) {
      _crossroads2.default.parse(path, [req, res]);
    }
  }, {
    key: 'reverse',
    value: function reverse(state) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = _stateRouteMapping[state].interpolate(params); //eslint-disable-line no-shadow
      return '/' + url;
    }
  }, {
    key: 'navigate',
    value: function navigate(state) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = RouteUtils.reverse(state, params); //eslint-disable-line no-shadow
      if (_contexts.runtime.isClient) {
        var history = require('html5-history-api');
        history.pushState(null, null, url);
        RouteUtils.parseUrl(url);
      }
    }
  }, {
    key: 'query',
    value: function query() {
      //TODO: server side
      var href = window.location.href;
      var result = {};
      if (href.includes('#')) {
        href = href.split('#')[1];
      }
      href = href.split('?')[1];
      if (href) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = href.split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var param = _step.value;

            var _param$split = param.split('=');

            var _param$split2 = _slicedToArray(_param$split, 2);

            var k = _param$split2[0];
            var v = _param$split2[1];

            result[decodeURIComponent(k)] = decodeURIComponent(v);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return result;
    }
  }, {
    key: 'isState',
    value: function isState(state) {
      var className = arguments.length <= 1 || arguments[1] === undefined ? 'active' : arguments[1];

      if (_contexts.global.state.indexOf(state) === 0) {
        return className;
      }
    }
  }]);

  return RouteUtils;
}();

var BaseRouter = exports.BaseRouter = function () {
  function BaseRouter() {
    var _this = this;

    var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, BaseRouter);

    if (prefix !== '') {
      prefix = prefix + '/';
    }
    //find subRoutes
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      var _loop = function _loop() {
        var rt = _step2.value;

        var rtObj = _this.urlPatterns[rt];
        if (rt !== '') {
          rt = rt + '/';
        }
        if (rtObj instanceof IncludeDefinition) {
          //instantiate sub router
          new rtObj.router('' + prefix + rt); //eslint-disable-line new-cap, no-new
        } else {
            rUrl = '' + prefix + rt;

            _stateRouteMapping[rtObj.state] = _crossroads2.default.addRoute(rUrl, function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              //eslint-disable-line no-loop-func
              _this.routeTo.apply(_this, [rtObj].concat(args));
            });
          }
      };

      for (var _iterator2 = Object.keys(this.urlPatterns)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var rUrl;

        _loop();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  _createClass(BaseRouter, [{
    key: 'routeTo',
    value: function routeTo(urlDef, req, res) {
      for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      var Controller = urlDef.controller;
      var midPromises = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _contexts.runtime.middleware[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var mid = _step3.value;

          if (mid.preControllerInit) {
            midPromises.push(mid.preControllerInit());
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      Promise.all(midPromises).then(function () {
        _contexts.global.state = urlDef.state;
        var controller = new Controller(req, res);
        if (_contexts.runtime.isClient) {
          controller.reconcileWithServer();
        }
        controller.init.apply(controller, args);
      }, function (error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }, {
    key: 'urlPatterns',
    get: function get() {
      throw 'NotImplemented';
    }
  }]);

  return BaseRouter;
}();

var Link = exports.Link = function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Link).apply(this, arguments));
  }

  _createClass(Link, [{
    key: 'handleClick',
    value: function handleClick(event) {
      var allowTransition = true;

      if (this.props.onClick) {
        this.props.onClick(event);
      }

      if (Link.isModifiedEvent(event) || !Link.isLeftClickEvent(event)) {
        return;
      }

      if (event.defaultPrevented === true) {
        allowTransition = false;
      }

      // If target prop is set (e.g. to "_blank") let browser handle link.
      if (this.props.target) {
        if (!allowTransition) {
          event.preventDefault();
        }
        return;
      }

      event.preventDefault();

      if (allowTransition) {
        var _props = this.props;
        var state = _props.state;
        var params = _props.params;

        RouteUtils.navigate(state, params);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = {};
      props.href = RouteUtils.reverse(this.props.state, this.props.params);
      if (this.props.activeClassName) {
        if (RouteUtils.isState(this.props.state)) {
          props.className = this.props.className === '' ? this.props.activeClassName : this.props.className + ' ' + this.props.activeClassName;
        }
      }
      props.children = this.props.children;
      return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick.bind(this) }));
    }
  }], [{
    key: 'isLeftClickEvent',
    value: function isLeftClickEvent(event) {
      return event.button === 0;
    }
  }, {
    key: 'isModifiedEvent',
    value: function isModifiedEvent(event) {
      return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
  }]);

  return Link;
}(_react2.default.Component);