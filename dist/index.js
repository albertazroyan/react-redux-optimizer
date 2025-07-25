'use strict';

var React = require('react');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (var _i = 0, _keysA = keysA; _i < _keysA.length; _i++) {
    var key = _keysA[_i];
    if (!Object.prototype.hasOwnProperty.call(objB, key) || objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}
var canUseSyncExternalStore = typeof React.useSyncExternalStore === 'function';
function useIdealSelector(store, selector) {
  var equalityFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : shallowEqual;
  var latestSelectedRef = React.useRef(selector(store.getState()));
  var getSnapshot = React.useCallback(function () {
    return latestSelectedRef.current;
  }, []);
  var subscribe = React.useCallback(function (callback) {
    return store.subscribe(function () {
      var newSelected = selector(store.getState());
      if (!equalityFn(latestSelectedRef.current, newSelected)) {
        latestSelectedRef.current = newSelected;
        callback();
      }
    });
  }, [store, selector, equalityFn]);
  if (canUseSyncExternalStore) {
    return React.useSyncExternalStore(subscribe, getSnapshot);
  } else {
    var _React$useState = React.useState(latestSelectedRef.current),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];
    React.useEffect(function () {
      var checkForUpdates = function checkForUpdates() {
        var newSelected = selector(store.getState());
        if (!equalityFn(latestSelectedRef.current, newSelected)) {
          latestSelectedRef.current = newSelected;
          setSelected(newSelected);
        }
      };
      var unsubscribe = store.subscribe(checkForUpdates);
      checkForUpdates();
      return unsubscribe;
    }, [store, selector, equalityFn]);
    return selected;
  }
}

exports.useIdealSelector = useIdealSelector;
