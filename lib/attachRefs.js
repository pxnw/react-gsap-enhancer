'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = attachRefs;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attachRefs(element, itemMap) {
  var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var key = element.key,
      previousRef = element.ref;

  if (key === null) {
    key = idx;
  }

  if (typeof previousRef === 'string') {
    throw Error('[react-gsap-enhancer] On one of the elements you have used a ' + ('string ref ("' + previousRef + '") but react-gsap-enhancer can only handle ') + 'callback refs. Please migrate the string refs to callback refs in the ' + 'enhanced component.\nExample: change <div ref=\'foo\'/> to <div ref={comp => this.foo = comp}/>\nSee also: https://github.com/azazdeaz/react-gsap-enhancer/issues/3');
  }

  var item;
  if (itemMap.has(key)) {
    item = itemMap.get(key);
  } else {
    item = { children: new Map() };
    itemMap.set(key, item);
  }

  if (!item.ref) {
    item.ref = function (component) {
      var node = _reactDom2.default.findDOMNode(component);
      item.props = element.props;
      item.node = node;

      if (typeof previousRef === 'function') {
        previousRef(component);
      }
    };
  }

  var originalChildren = element.props.children;
  var children = void 0;
  if ((typeof originalChildren === 'undefined' ? 'undefined' : _typeof(originalChildren)) !== 'object') {
    children = originalChildren;
  } else if ((0, _react.isValidElement)(originalChildren)) {
    children = cloneChild(originalChildren);
  } else {
    children = _react.Children.map(originalChildren, function (child, childIdx) {
      return cloneChild(child, childIdx);
    });
  }

  function cloneChild(child, childIdx) {
    if (_react2.default.isValidElement(child)) {
      return attachRefs(child, item.children, childIdx);
    } else {
      return child;
    }
  }

  return _react2.default.cloneElement(element, { ref: item.ref, children: children });
}
//# sourceMappingURL=attachRefs.js.map