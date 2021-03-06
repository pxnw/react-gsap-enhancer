'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
  function Controller(animationSource, options, target, onNeedReattachAllAninmations, remove) {
    _classCallCheck(this, Controller);

    this._animationSource = animationSource;
    this._target = target;
    this._options = options;
    this._onNeedReattachAllAninmations = onNeedReattachAllAninmations;
    this._remove = remove;
    this._commandsWaitingForAttach = [];
  }

  //Not documented. For internal usage. (animachine)


  _createClass(Controller, [{
    key: 'replaceAnimationSource',
    value: function replaceAnimationSource(animationSource) {
      if (this._gsapAnimation) {
        this._gsapAnimation.kill();
        this._gsapAnimation = undefined;
        this._animationSource = animationSource;
        this._onNeedReattachAllAninmations();
      } else {
        //it's not attached yet
        this._animationSource = animationSource;
      }
    }
  }, {
    key: 'attach',
    value: function attach() {
      var _this = this;

      if (this._gsapAnimation) {
        var time = this._gsapAnimation.time();
        var paused = this._gsapAnimation.paused();
        var reversed = this._gsapAnimation.reversed();
        this._gsapAnimation.invalidate().restart(false, true) //suppress events
        .time(time, true); //suppress events - http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/time/
        if (paused) {
          this._gsapAnimation.pause(null, true); //suppress events
        }
        if (reversed) {
          this._gsapAnimation.reverse(null, true); //suppress events
        }
      } else {
        this._gsapAnimation = this._animationSource({
          target: this._target,
          options: this._options
        });

        if (process.env.NODE_ENV !== 'production') {
          if (!this._gsapAnimation || typeof this._gsapAnimation.play !== 'function') {
            throw Error('[react-gsap-enhancer] The return value of the animation ' + 'source doesn\'t seems to be a GSAP Animation' + ('\nCheck out this animation source: \n' + this._animationSource) + ('\nbecause it returned this value: ' + this._gsapAnimation) + '\n\n' + 'If you\'re using something like TweenMax.staggerTo() witch returns' + ' an array of GSAP Animations please use Timeline (like' + ' TimelineMax.staggerTo()) instead. It has the same effect' + ' but returns one object.');
          }
        }
      }

      this._commandsWaitingForAttach.splice(0).forEach(function (_ref) {
        var fnName = _ref.fnName,
            args = _ref.args;
        return _this[fnName].apply(_this, _toConsumableArray(args));
      });
    }
  }, {
    key: 'kill',
    value: function kill() {
      if (this._gsapAnimation) {
        this._gsapAnimation.kill();
      }
      this._remove(this);
    }
  }, {
    key: 'gsapAnimation',
    get: function get() {
      return this._gsapAnimation;
    }
  }]);

  return Controller;
}();

exports.default = Controller;


var EXPOSED_METHODS = ['currentLabel', 'delay', 'duration', 'endTime', 'eventCallback', 'from', 'fromTo', 'getLabelAfter', 'getLabelArray', 'getLabelBefore', 'getLabelTime', 'invalidate', 'isActive', 'pause', 'paused', 'play', 'progress', 'restart', 'resume', 'reverse', 'reversed', 'seek', 'startTime', 'time', 'timeScale', 'totalDuration', 'totalProgress', 'totalTime', 'tweenFromTo', 'tweenTo'];

var ONLY_GETTER_METHODS = [
  // 'delay',
  // 'duration',
  // 'startTime',
  // 'totalDuration',
  // 'totalProgress',
  // 'totalTime',
  // 'endTime'
];

function bindAPI() {
  EXPOSED_METHODS
  //remove duplications
  .filter(function (item, pos, arr) {
    return arr.indexOf(item) === pos;
  }).forEach(function (fnName) {
    Controller.prototype[fnName] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = void 0;
      var onlyGetter = ONLY_GETTER_METHODS.indexOf(fnName) !== -1;

      if (!this._gsapAnimation) {
        //if the animation doesn't attached yet, schedule the API call
        this._commandsWaitingForAttach.push({ fnName: fnName, args: args });
      } else if (typeof this._gsapAnimation[fnName] === 'function') {
        var _gsapAnimation;

        if (process.env.NODE_ENV !== 'production') {
          if (onlyGetter && args.length !== 0) {
            console.warn('[react-gsap-enhancer] controller.' + fnName + ' is only a getter ' + 'but it looks like you tried to use as a getter by calling ' + ('it with the following arguments: "' + args + '"'));
          }
        }

        result = onlyGetter ? this._gsapAnimation[fnName]() : (_gsapAnimation = this._gsapAnimation)[fnName].apply(_gsapAnimation, args);
      } else {
        throw Error('[react-gsap-enhancer] Animation source has no method: \'' + fnName + '.\'' + '\nYou maybe tryed to use an only TweenMax method on TweenLite instance' + '\nCheck GSAP docs for more detailes: http://greensock.com/docs/#/HTML5/GSAP/');
      }
      return result === this._gsapAnimation ? this : result;
    };
  });
}
bindAPI();
//# sourceMappingURL=Controller.js.map