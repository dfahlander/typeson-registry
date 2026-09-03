'use strict';

var node_module = require('node:module');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch (e) {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var whatwgUrl = {};

var webidl2jsWrapper = {};

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _classPrivateMethodInitSpec(e, a) {
  _checkPrivateRedeclaration(e, a), a.add(e);
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
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
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return _regeneratorDefine(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = false,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function (t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = true, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), true), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
    return this;
  }), _regeneratorDefine(u, "toString", function () {
    return "[object Generator]";
  }), (_regenerator = function () {
    return {
      w: i,
      m: f
    };
  })();
}
function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  _regeneratorDefine = function (e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r ? i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
  }, _regeneratorDefine(e, r, n, t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

var conversions$1 = require("webidl-conversions");
var utils$1 = require("./utils.js");
var implSymbol$1 = utils$1.implSymbol;
var ctorRegistrySymbol$1 = utils$1.ctorRegistrySymbol;
var interfaceName$1 = "URL";
exports.is = function (value) {
  return utils$1.isObject(value) && Object.hasOwn(value, implSymbol$1) && value[implSymbol$1] instanceof Impl$1.implementation;
};
exports.isImpl = function (value) {
  return utils$1.isObject(value) && value instanceof Impl$1.implementation;
};
exports.convert = function (globalObject, value) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref$context = _ref.context,
    context = _ref$context === void 0 ? "The provided value" : _ref$context;
  if (exports.is(value)) {
    return utils$1.implForWrapper(value);
  }
  throw new globalObject.TypeError("".concat(context, " is not of type 'URL'."));
};
function makeWrapper$1(globalObject, newTarget) {
  var proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }
  if (!utils$1.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol$1]["URL"].prototype;
  }
  return Object.create(proto);
}
exports.create = function (globalObject, constructorArgs, privateData) {
  var wrapper = makeWrapper$1(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};
exports.createImpl = function (globalObject, constructorArgs, privateData) {
  var wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils$1.implForWrapper(wrapper);
};
exports._internalSetup = function (wrapper, globalObject) {};
exports.setup = function (wrapper, globalObject) {
  var constructorArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var privateData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  privateData.wrapper = wrapper;
  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol$1, {
    value: new Impl$1.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });
  wrapper[implSymbol$1][utils$1.wrapperSymbol] = wrapper;
  if (Impl$1.init) {
    Impl$1.init(wrapper[implSymbol$1]);
  }
  return wrapper;
};
exports["new"] = function (globalObject, newTarget) {
  var wrapper = makeWrapper$1(globalObject, newTarget);
  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol$1, {
    value: Object.create(Impl$1.implementation.prototype),
    configurable: true
  });
  wrapper[implSymbol$1][utils$1.wrapperSymbol] = wrapper;
  if (Impl$1.init) {
    Impl$1.init(wrapper[implSymbol$1]);
  }
  return wrapper[implSymbol$1];
};
var exposed$1 = new Set(["Window", "Worker"]);
exports.install = function (globalObject, globalNames) {
  if (!globalNames.some(function (globalName) {
    return exposed$1.has(globalName);
  })) {
    return;
  }
  var ctorRegistry = utils$1.initCtorRegistry(globalObject);
  var URL = /*#__PURE__*/function () {
    function URL(url) {
      _classCallCheck(this, URL);
      if (arguments.length < 1) {
        throw new globalObject.TypeError("Failed to construct 'URL': 1 argument required, but only ".concat(arguments.length, " present."));
      }
      var args = [];
      {
        var curArg = arguments[0];
        curArg = conversions$1["USVString"](curArg, {
          context: "Failed to construct 'URL': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        var _curArg = arguments[1];
        if (_curArg !== undefined) {
          _curArg = conversions$1["USVString"](_curArg, {
            context: "Failed to construct 'URL': parameter 2",
            globals: globalObject
          });
        }
        args.push(_curArg);
      }
      return exports.setup(Object.create((this instanceof URL ? this.constructor : void 0).prototype), globalObject, args);
    }
    return _createClass(URL, [{
      key: "toJSON",
      value: function toJSON() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1].toJSON();
      }
    }, {
      key: "href",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get href' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["href"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set href' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'href' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["href"] = V;
      }
    }, {
      key: "toString",
      value: function toString() {
        var esValue = this;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'toString' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["href"];
      }
    }, {
      key: "origin",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get origin' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["origin"];
      }
    }, {
      key: "protocol",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["protocol"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'protocol' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["protocol"] = V;
      }
    }, {
      key: "username",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get username' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["username"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set username' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'username' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["username"] = V;
      }
    }, {
      key: "password",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get password' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["password"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set password' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'password' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["password"] = V;
      }
    }, {
      key: "host",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get host' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["host"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set host' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'host' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["host"] = V;
      }
    }, {
      key: "hostname",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["hostname"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'hostname' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["hostname"] = V;
      }
    }, {
      key: "port",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get port' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["port"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set port' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'port' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["port"] = V;
      }
    }, {
      key: "pathname",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["pathname"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'pathname' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["pathname"] = V;
      }
    }, {
      key: "search",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get search' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["search"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set search' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'search' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["search"] = V;
      }
    }, {
      key: "searchParams",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
        }
        return utils$1.getSameObject(this, "searchParams", function () {
          return utils$1.tryWrapperForImpl(esValue[implSymbol$1]["searchParams"]);
        });
      }
    }, {
      key: "hash",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get hash' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol$1]["hash"];
      },
      set: function set(V) {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set hash' called on an object that is not a valid instance of URL.");
        }
        V = conversions$1["USVString"](V, {
          context: "Failed to set the 'hash' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol$1]["hash"] = V;
      }
    }], [{
      key: "parse",
      value: function parse(url) {
        var _Impl$implementation;
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'parse' on 'URL': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions$1["USVString"](curArg, {
            context: "Failed to execute 'parse' on 'URL': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg2 = arguments[1];
          if (_curArg2 !== undefined) {
            _curArg2 = conversions$1["USVString"](_curArg2, {
              context: "Failed to execute 'parse' on 'URL': parameter 2",
              globals: globalObject
            });
          }
          args.push(_curArg2);
        }
        return utils$1.tryWrapperForImpl((_Impl$implementation = Impl$1.implementation).parse.apply(_Impl$implementation, [globalObject].concat(args)));
      }
    }, {
      key: "canParse",
      value: function canParse(url) {
        var _Impl$implementation2;
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'canParse' on 'URL': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions$1["USVString"](curArg, {
            context: "Failed to execute 'canParse' on 'URL': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg3 = arguments[1];
          if (_curArg3 !== undefined) {
            _curArg3 = conversions$1["USVString"](_curArg3, {
              context: "Failed to execute 'canParse' on 'URL': parameter 2",
              globals: globalObject
            });
          }
          args.push(_curArg3);
        }
        return (_Impl$implementation2 = Impl$1.implementation).canParse.apply(_Impl$implementation2, args);
      }
    }]);
  }();
  Object.defineProperties(URL.prototype, _defineProperty({
    toJSON: {
      enumerable: true
    },
    href: {
      enumerable: true
    },
    toString: {
      enumerable: true
    },
    origin: {
      enumerable: true
    },
    protocol: {
      enumerable: true
    },
    username: {
      enumerable: true
    },
    password: {
      enumerable: true
    },
    host: {
      enumerable: true
    },
    hostname: {
      enumerable: true
    },
    port: {
      enumerable: true
    },
    pathname: {
      enumerable: true
    },
    search: {
      enumerable: true
    },
    searchParams: {
      enumerable: true
    },
    hash: {
      enumerable: true
    }
  }, Symbol.toStringTag, {
    value: "URL",
    configurable: true
  }));
  Object.defineProperties(URL, {
    parse: {
      enumerable: true
    },
    canParse: {
      enumerable: true
    }
  });
  ctorRegistry[interfaceName$1] = URL;
  Object.defineProperty(globalObject, interfaceName$1, {
    configurable: true,
    writable: true,
    value: URL
  });
  if (globalNames.includes("Window")) {
    Object.defineProperty(globalObject, "webkitURL", {
      configurable: true,
      writable: true,
      value: URL
    });
  }
};
var Impl$1 = require("./URL-impl.js");

var URL$1 = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(URL$1);

var conversions = require("webidl-conversions");
var utils = require("./utils.js");
var Function$1 = require("./Function.js");
var newObjectInRealm = utils.newObjectInRealm;
var implSymbol = utils.implSymbol;
var ctorRegistrySymbol = utils.ctorRegistrySymbol;
var interfaceName = "URLSearchParams";
exports.is = function (value) {
  return utils.isObject(value) && Object.hasOwn(value, implSymbol) && value[implSymbol] instanceof Impl.implementation;
};
exports.isImpl = function (value) {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = function (globalObject, value) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref$context = _ref.context,
    context = _ref$context === void 0 ? "The provided value" : _ref$context;
  if (exports.is(value)) {
    return utils.implForWrapper(value);
  }
  throw new globalObject.TypeError("".concat(context, " is not of type 'URLSearchParams'."));
};
exports.createDefaultIterator = function (globalObject, target, kind) {
  var ctorRegistry = globalObject[ctorRegistrySymbol];
  var iteratorPrototype = ctorRegistry["URLSearchParams Iterator"];
  var iterator = Object.create(iteratorPrototype);
  Object.defineProperty(iterator, utils.iterInternalSymbol, {
    value: {
      target: target,
      kind: kind,
      index: 0
    },
    configurable: true
  });
  return iterator;
};
function makeWrapper(globalObject, newTarget) {
  var proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }
  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["URLSearchParams"].prototype;
  }
  return Object.create(proto);
}
exports.create = function (globalObject, constructorArgs, privateData) {
  var wrapper = makeWrapper(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};
exports.createImpl = function (globalObject, constructorArgs, privateData) {
  var wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};
exports._internalSetup = function (wrapper, globalObject) {};
exports.setup = function (wrapper, globalObject) {
  var constructorArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var privateData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  privateData.wrapper = wrapper;
  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });
  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper;
};
exports["new"] = function (globalObject, newTarget) {
  var wrapper = makeWrapper(globalObject, newTarget);
  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: Object.create(Impl.implementation.prototype),
    configurable: true
  });
  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper[implSymbol];
};
var exposed = new Set(["Window", "Worker"]);
exports.install = function (globalObject, globalNames) {
  if (!globalNames.some(function (globalName) {
    return exposed.has(globalName);
  })) {
    return;
  }
  var ctorRegistry = utils.initCtorRegistry(globalObject);
  var URLSearchParams = /*#__PURE__*/function () {
    function URLSearchParams() {
      _classCallCheck(this, URLSearchParams);
      var args = [];
      {
        var curArg = arguments[0];
        if (curArg !== undefined) {
          if (utils.isObject(curArg)) {
            if (utils.getMethod(curArg, Symbol.iterator, "Failed to construct 'URLSearchParams': parameter 1") !== undefined) {
              if (!utils.isObject(curArg)) {
                throw new globalObject.TypeError("Failed to construct 'URLSearchParams': parameter 1" + " sequence" + " is not an iterable object.");
              } else {
                var V = [];
                var tmp = curArg;
                var _iterator = _createForOfIteratorHelper(tmp),
                  _step;
                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var nextItem = _step.value;
                    if (!utils.isObject(nextItem)) {
                      throw new globalObject.TypeError("Failed to construct 'URLSearchParams': parameter 1" + " sequence" + "'s element" + " is not an iterable object.");
                    } else {
                      var _V = [];
                      var _tmp = nextItem;
                      var _iterator2 = _createForOfIteratorHelper(_tmp),
                        _step2;
                      try {
                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                          var _nextItem = _step2.value;
                          _nextItem = conversions["USVString"](_nextItem, {
                            context: "Failed to construct 'URLSearchParams': parameter 1" + " sequence" + "'s element" + "'s element",
                            globals: globalObject
                          });
                          _V.push(_nextItem);
                        }
                      } catch (err) {
                        _iterator2.e(err);
                      } finally {
                        _iterator2.f();
                      }
                      nextItem = _V;
                    }
                    V.push(nextItem);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
                curArg = V;
              }
            } else {
              if (!utils.isObject(curArg)) {
                throw new globalObject.TypeError("Failed to construct 'URLSearchParams': parameter 1" + " record" + " is not an object.");
              } else {
                var result = Object.create(null);
                var _iterator3 = _createForOfIteratorHelper(Reflect.ownKeys(curArg)),
                  _step3;
                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var key = _step3.value;
                    var desc = Object.getOwnPropertyDescriptor(curArg, key);
                    if (desc && desc.enumerable) {
                      var typedKey = key;
                      typedKey = conversions["USVString"](typedKey, {
                        context: "Failed to construct 'URLSearchParams': parameter 1" + " record" + "'s key",
                        globals: globalObject
                      });
                      var typedValue = curArg[key];
                      typedValue = conversions["USVString"](typedValue, {
                        context: "Failed to construct 'URLSearchParams': parameter 1" + " record" + "'s value",
                        globals: globalObject
                      });
                      result[typedKey] = typedValue;
                    }
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }
                curArg = result;
              }
            }
          } else {
            curArg = conversions["USVString"](curArg, {
              context: "Failed to construct 'URLSearchParams': parameter 1",
              globals: globalObject
            });
          }
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      return exports.setup(Object.create((this instanceof URLSearchParams ? this.constructor : void 0).prototype), globalObject, args);
    }
    return _createClass(URLSearchParams, [{
      key: "append",
      value: function append(name, value) {
        var _esValue$implSymbol;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 2) {
          throw new globalObject.TypeError("Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg = arguments[1];
          _curArg = conversions["USVString"](_curArg, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
            globals: globalObject
          });
          args.push(_curArg);
        }
        return utils.tryWrapperForImpl((_esValue$implSymbol = esValue[implSymbol]).append.apply(_esValue$implSymbol, args));
      }
    }, {
      key: "delete",
      value: function _delete(name) {
        var _esValue$implSymbol2;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg2 = arguments[1];
          if (_curArg2 !== undefined) {
            _curArg2 = conversions["USVString"](_curArg2, {
              context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
              globals: globalObject
            });
          }
          args.push(_curArg2);
        }
        return utils.tryWrapperForImpl((_esValue$implSymbol2 = esValue[implSymbol])["delete"].apply(_esValue$implSymbol2, args));
      }
    }, {
      key: "get",
      value: function get(name) {
        var _esValue$implSymbol3;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        return (_esValue$implSymbol3 = esValue[implSymbol]).get.apply(_esValue$implSymbol3, args);
      }
    }, {
      key: "getAll",
      value: function getAll(name) {
        var _esValue$implSymbol4;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        return utils.tryWrapperForImpl((_esValue$implSymbol4 = esValue[implSymbol]).getAll.apply(_esValue$implSymbol4, args));
      }
    }, {
      key: "has",
      value: function has(name) {
        var _esValue$implSymbol5;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg3 = arguments[1];
          if (_curArg3 !== undefined) {
            _curArg3 = conversions["USVString"](_curArg3, {
              context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
              globals: globalObject
            });
          }
          args.push(_curArg3);
        }
        return (_esValue$implSymbol5 = esValue[implSymbol]).has.apply(_esValue$implSymbol5, args);
      }
    }, {
      key: "set",
      value: function set(name, value) {
        var _esValue$implSymbol6;
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 2) {
          throw new globalObject.TypeError("Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ".concat(arguments.length, " present."));
        }
        var args = [];
        {
          var curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          var _curArg4 = arguments[1];
          _curArg4 = conversions["USVString"](_curArg4, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
            globals: globalObject
          });
          args.push(_curArg4);
        }
        return utils.tryWrapperForImpl((_esValue$implSymbol6 = esValue[implSymbol]).set.apply(_esValue$implSymbol6, args));
      }
    }, {
      key: "sort",
      value: function sort() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
        }
        return utils.tryWrapperForImpl(esValue[implSymbol].sort());
      }
    }, {
      key: "toString",
      value: function toString() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
        }
        return esValue[implSymbol].toString();
      }
    }, {
      key: "keys",
      value: function keys() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
        }
        return exports.createDefaultIterator(globalObject, this, "key");
      }
    }, {
      key: "values",
      value: function values() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
        }
        return exports.createDefaultIterator(globalObject, this, "value");
      }
    }, {
      key: "entries",
      value: function entries() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
        }
        return exports.createDefaultIterator(globalObject, this, "key+value");
      }
    }, {
      key: "forEach",
      value: function forEach(callback) {
        if (!exports.is(this)) {
          throw new globalObject.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
        }
        callback = Function$1.convert(globalObject, callback, {
          context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
        });
        var thisArg = arguments[1];
        var pairs = Array.from(this[implSymbol]);
        var i = 0;
        while (i < pairs.length) {
          var _pairs$i$map = pairs[i].map(utils.tryWrapperForImpl),
            _pairs$i$map2 = _slicedToArray(_pairs$i$map, 2),
            key = _pairs$i$map2[0],
            value = _pairs$i$map2[1];
          callback.call(thisArg, value, key, this);
          pairs = Array.from(this[implSymbol]);
          i++;
        }
      }
    }, {
      key: "size",
      get: function get() {
        var esValue = this !== null && this !== undefined ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
        }
        return esValue[implSymbol]["size"];
      }
    }]);
  }();
  Object.defineProperties(URLSearchParams.prototype, _defineProperty(_defineProperty({
    append: {
      enumerable: true
    },
    "delete": {
      enumerable: true
    },
    get: {
      enumerable: true
    },
    getAll: {
      enumerable: true
    },
    has: {
      enumerable: true
    },
    set: {
      enumerable: true
    },
    sort: {
      enumerable: true
    },
    toString: {
      enumerable: true
    },
    keys: {
      enumerable: true
    },
    values: {
      enumerable: true
    },
    entries: {
      enumerable: true
    },
    forEach: {
      enumerable: true
    },
    size: {
      enumerable: true
    }
  }, Symbol.toStringTag, {
    value: "URLSearchParams",
    configurable: true
  }), Symbol.iterator, {
    value: URLSearchParams.prototype.entries,
    configurable: true,
    writable: true
  }));
  ctorRegistry[interfaceName] = URLSearchParams;
  ctorRegistry["URLSearchParams Iterator"] = Object.create(ctorRegistry["%IteratorPrototype%"], _defineProperty({}, Symbol.toStringTag, {
    configurable: true,
    value: "URLSearchParams Iterator"
  }));
  utils.define(ctorRegistry["URLSearchParams Iterator"], {
    next: function next() {
      var internal = this && this[utils.iterInternalSymbol];
      if (!internal) {
        throw new globalObject.TypeError("next() called on a value that is not a URLSearchParams iterator object");
      }
      var target = internal.target,
        kind = internal.kind,
        index = internal.index;
      var values = Array.from(target[implSymbol]);
      var len = values.length;
      if (index >= len) {
        return newObjectInRealm(globalObject, {
          value: undefined,
          done: true
        });
      }
      var pair = values[index];
      internal.index = index + 1;
      return newObjectInRealm(globalObject, utils.iteratorResult(pair.map(utils.tryWrapperForImpl), kind));
    }
  });
  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: URLSearchParams
  });
};
var Impl = require("./URLSearchParams-impl.js");

var URLSearchParams = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$1$2 = /*@__PURE__*/getAugmentedNamespace(URLSearchParams);

var hasRequiredWebidl2jsWrapper;

function requireWebidl2jsWrapper () {
	if (hasRequiredWebidl2jsWrapper) return webidl2jsWrapper;
	hasRequiredWebidl2jsWrapper = 1;

	var URL = require$$0;
	var URLSearchParams = require$$1$2;
	webidl2jsWrapper.URL = URL;
	webidl2jsWrapper.URLSearchParams = URLSearchParams;
	return webidl2jsWrapper;
}

require("@exodus/bytes/encoding.js"); // for legacy multi-byte encodings
var _require$2 = require("@exodus/bytes/whatwg.js"),
  percentEncodeAfterEncoding = _require$2.percentEncodeAfterEncoding;
var infra$2 = require("./infra");
var _require2$1 = require("./encoding"),
  utf8DecodeWithoutBOM = _require2$1.utf8DecodeWithoutBOM;
var _require3 = require("./url-miscellaneous"),
  containsForbiddenHostCodePoint$1 = _require3.containsForbiddenHostCodePoint,
  containsPercentEncodedByte$1 = _require3.containsPercentEncodedByte,
  defaultPort$1 = _require3.defaultPort,
  domainParser$1 = _require3.domainParser,
  endsInANumber$1 = _require3.endsInANumber,
  failure$1 = _require3.failure,
  isInvalidURLCodePoint$1 = _require3.isInvalidURLCodePoint,
  isNormalizedWindowsDriveLetterString$1 = _require3.isNormalizedWindowsDriveLetterString,
  isSpecialScheme$1 = _require3.isSpecialScheme,
  isWindowsDriveLetterCodePoints$1 = _require3.isWindowsDriveLetterCodePoints,
  isWindowsDriveLetterString$1 = _require3.isWindowsDriveLetterString,
  parseIPv4Number$1 = _require3.parseIPv4Number,
  p$2 = _require3.p;
var _require4 = require("./percent-encoding"),
  percentDecodeString$1 = _require4.percentDecodeString,
  utf8PercentEncodeCodePoint$1 = _require4.utf8PercentEncodeCodePoint,
  utf8PercentEncodeString$1 = _require4.utf8PercentEncodeString,
  isC0ControlPercentEncode$1 = _require4.isC0ControlPercentEncode,
  isFragmentPercentEncode$1 = _require4.isFragmentPercentEncode,
  extraQueryPercentEncodeChars$1 = _require4.extraQueryPercentEncodeChars,
  extraSpecialQueryPercentEncodeChars$1 = _require4.extraSpecialQueryPercentEncodeChars,
  isPathPercentEncode$1 = _require4.isPathPercentEncode,
  isUserinfoPercentEncode$1 = _require4.isUserinfoPercentEncode;
function countSymbols(str) {
  return _toConsumableArray(str).length;
}
function at(input, idx) {
  var c = input[idx];
  return isNaN(c) ? undefined : String.fromCodePoint(c);
}
function isSingleDot(buffer) {
  return buffer === "." || buffer.toLowerCase() === "%2e";
}
function isDoubleDot(buffer) {
  buffer = buffer.toLowerCase();
  return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}
function isInvalidPercentEncoding(input, pointer) {
  return input[pointer] === p$2("%") && (!infra$2.isASCIIHex(input[pointer + 1]) || !infra$2.isASCIIHex(input[pointer + 2]));
}
function validateURLUnits(input) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (validationErrors === null) {
    return;
  }
  var codePoints = Array.from(input, function (c) {
    return c.codePointAt(0);
  });
  if (codePoints.some(isInvalidURLCodePoint$1)) {
    validationErrors.push("invalid-URL-unit");
  }
  if (codePoints.some(function (_, i) {
    return isInvalidPercentEncoding(codePoints, i);
  })) {
    validationErrors.push("invalid-URL-unit");
  }
}
function isSpecial(url) {
  return isSpecialScheme$1(url.scheme);
}
function isNotSpecial(url) {
  return !isSpecialScheme$1(url.scheme);
}
function parseIPv4(input) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-empty-part");
    if (parts.length > 1) {
      parts.pop();
    }
  }
  if (parts.length > 4) {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-too-many-parts");
    return failure$1;
  }
  if (parts.length < 4) {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-too-few-parts");
  }
  var numbers = [];
  var _iterator = _createForOfIteratorHelper(parts),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var _n = parseIPv4Number$1(part, validationErrors);
      if (_n === failure$1) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-non-numeric-part");
        return failure$1;
      }
      numbers.push(_n);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (validationErrors !== null && numbers.some(function (n) {
    return n > 255;
  })) {
    validationErrors.push("IPv4-out-of-range-part");
  }
  for (var i = 0; i < numbers.length - 1; ++i) {
    if (numbers[i] > 255) {
      return failure$1;
    }
  }
  if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
    return failure$1;
  }
  var ipv4 = numbers.pop();
  var counter = 0;
  for (var _i = 0, _numbers = numbers; _i < _numbers.length; _i++) {
    var n = _numbers[_i];
    ipv4 += n * Math.pow(256, 3 - counter);
    ++counter;
  }
  return ipv4;
}
function serializeIPv4(address) {
  var output = "";
  var n = address;
  for (var i = 1; i <= 4; ++i) {
    output = String(n % 256) + output;
    if (i !== 4) {
      output = ".".concat(output);
    }
    n = Math.floor(n / 256);
  }
  return output;
}
function parseIPv6(input) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  input = Array.from(input, function (c) {
    return c.codePointAt(0);
  });
  if (input[pointer] === p$2(":")) {
    if (input[pointer + 1] !== p$2(":")) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-invalid-compression");
      return failure$1;
    }
    pointer += 2;
    ++pieceIndex;
    compress = pieceIndex;
  }
  while (pointer < input.length) {
    if (pieceIndex === 8) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-too-many-pieces");
      return failure$1;
    }
    if (input[pointer] === p$2(":")) {
      if (compress !== null) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-multiple-compression");
        return failure$1;
      }
      ++pointer;
      ++pieceIndex;
      compress = pieceIndex;
      continue;
    }
    var value = 0;
    var length = 0;
    while (length < 4 && infra$2.isASCIIHex(input[pointer])) {
      value = value * 0x10 + parseInt(at(input, pointer), 16);
      ++pointer;
      ++length;
    }
    if (input[pointer] === p$2(".")) {
      if (length === 0) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-invalid-code-point");
        return failure$1;
      }
      pointer -= length;
      if (pieceIndex > 6) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-too-many-pieces");
        return failure$1;
      }
      var numbersSeen = 0;
      while (input[pointer] !== undefined) {
        var ipv4Piece = null;
        if (numbersSeen > 0) {
          if (input[pointer] === p$2(".") && numbersSeen < 4) {
            ++pointer;
          } else {
            validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-invalid-code-point");
            return failure$1;
          }
        }
        if (!infra$2.isASCIIDigit(input[pointer])) {
          validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-invalid-code-point");
          return failure$1;
        }
        while (infra$2.isASCIIDigit(input[pointer])) {
          var number = parseInt(at(input, pointer), 10);
          if (ipv4Piece === null) {
            ipv4Piece = number;
          } else if (ipv4Piece === 0) {
            validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-invalid-code-point");
            return failure$1;
          } else {
            ipv4Piece = ipv4Piece * 10 + number;
          }
          if (ipv4Piece > 255) {
            validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-out-of-range-part");
            return failure$1;
          }
          ++pointer;
        }
        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
        ++numbersSeen;
        if (numbersSeen === 2 || numbersSeen === 4) {
          ++pieceIndex;
        }
      }
      if (numbersSeen !== 4) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-in-IPv6-too-few-parts");
        return failure$1;
      }
      break;
    } else if (input[pointer] === p$2(":")) {
      ++pointer;
      if (input[pointer] === undefined) {
        validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-invalid-code-point");
        return failure$1;
      }
    } else if (input[pointer] !== undefined) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-invalid-code-point");
      return failure$1;
    }
    if (length > 1 && value < Math.pow(0x10, length - 1)) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-piece-leading-zero");
    }
    address[pieceIndex] = value;
    ++pieceIndex;
  }
  if (compress !== null) {
    var swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      var temp = address[compress + swaps - 1];
      address[compress + swaps - 1] = address[pieceIndex];
      address[pieceIndex] = temp;
      --pieceIndex;
      --swaps;
    }
  } else if (compress === null && pieceIndex !== 8) {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-too-few-pieces");
    return failure$1;
  }
  return address;
}
function serializeIPv6(address) {
  var output = "";
  var compress = findTheIPv6AddressCompressedPieceIndex(address);
  var ignore0 = false;
  for (var pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
    if (ignore0 && address[pieceIndex] === 0) {
      continue;
    } else if (ignore0) {
      ignore0 = false;
    }
    if (compress === pieceIndex) {
      var separator = pieceIndex === 0 ? "::" : ":";
      output += separator;
      ignore0 = true;
      continue;
    }
    output += address[pieceIndex].toString(16);
    if (pieceIndex !== 7) {
      output += ":";
    }
  }
  return output;
}
function parseHost(input) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var isOpaque = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (input[0] === "[") {
    if (input[input.length - 1] !== "]") {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv6-unclosed");
      return failure$1;
    }
    return parseIPv6(input.substring(1, input.length - 1), validationErrors);
  }
  if (isOpaque) {
    return parseOpaqueHost(input, validationErrors);
  }
  if (validationErrors && containsPercentEncodedByte$1(input)) {
    validationErrors.push("domain-percent-encoded");
  }
  var domain = utf8DecodeWithoutBOM(percentDecodeString$1(input));
  var asciiDomain = domainParser$1(domain, validationErrors);
  if (asciiDomain === failure$1) {
    return failure$1;
  }
  if (endsInANumber$1(asciiDomain)) {
    if (!infra$2.isASCIIString(domain)) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-non-ASCII-input");
    }
    return parseIPv4(asciiDomain, validationErrors);
  }
  return asciiDomain;
}
function parseOpaqueHost(input, validationErrors) {
  if (containsForbiddenHostCodePoint$1(input)) {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("host-invalid-code-point");
    return failure$1;
  }
  validateURLUnits(input, validationErrors);
  return utf8PercentEncodeString$1(input, isC0ControlPercentEncode$1);
}
function findTheIPv6AddressCompressedPieceIndex(address) {
  var longestIndex = null;
  var longestSize = 1; // only find elements > 1
  var foundIndex = null;
  var foundSize = 0;
  for (var pieceIndex = 0; pieceIndex < address.length; ++pieceIndex) {
    if (address[pieceIndex] !== 0) {
      if (foundSize > longestSize) {
        longestIndex = foundIndex;
        longestSize = foundSize;
      }
      foundIndex = null;
      foundSize = 0;
    } else {
      if (foundIndex === null) {
        foundIndex = pieceIndex;
      }
      ++foundSize;
    }
  }
  if (foundSize > longestSize) {
    return foundIndex;
  }
  return longestIndex;
}
function serializeHost(host) {
  if (typeof host === "number") {
    return serializeIPv4(host);
  }

  // IPv6 serializer
  if (host instanceof Array) {
    return "[".concat(serializeIPv6(host), "]");
  }
  return host;
}
function trimControlChars(string) {
  // Avoid using regexp because of this V8 bug: https://issues.chromium.org/issues/42204424

  var start = 0;
  var end = string.length;
  for (; start < end; ++start) {
    if (string.charCodeAt(start) > 0x20) {
      break;
    }
  }
  for (; end > start; --end) {
    if (string.charCodeAt(end - 1) > 0x20) {
      break;
    }
  }
  return string.substring(start, end);
}
function trimTabAndNewline(url) {
  return url.replace(/\t|\n|\r/g, "");
}
function shortenPath(url) {
  var path = url.path;
  if (path.length === 0) {
    return;
  }
  if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetterString$1(path[0])) {
    return;
  }
  path.pop();
}
function includesCredentials(url) {
  return url.username !== "" || url.password !== "";
}
function cannotHaveAUsernamePasswordPort(url) {
  return url.host === null || url.host === "" || url.scheme === "file";
}
function hasAnOpaquePath(url) {
  return typeof url.path === "string";
}
function URLStateMachine(input, base, encoding, url, stateOverride) {
  var validationErrors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  this.pointer = 0;
  this.input = input;
  this.base = base || null;
  this.encoding = encoding || "utf-8";
  this.stateOverride = stateOverride;
  this.url = url;
  this.failure = false;
  this.validationErrors = validationErrors;
  if (!this.url) {
    this.url = {
      scheme: "",
      username: "",
      password: "",
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null
    };
    var _res = trimControlChars(this.input);
    if (_res !== this.input) {
      var _this$validationError;
      (_this$validationError = this.validationErrors) === null || _this$validationError === void 0 || _this$validationError.push("invalid-URL-unit");
    }
    this.input = _res;
  }
  var res = trimTabAndNewline(this.input);
  if (res !== this.input) {
    var _this$validationError2;
    (_this$validationError2 = this.validationErrors) === null || _this$validationError2 === void 0 || _this$validationError2.push("invalid-URL-unit");
  }
  this.input = res;
  this.state = stateOverride || "scheme start";
  this.buffer = "";
  this.atSignSeen = false;
  this.insideBrackets = false;
  this.passwordTokenSeen = false;
  this.input = Array.from(this.input, function (c) {
    return c.codePointAt(0);
  });
  for (; this.pointer <= this.input.length; ++this.pointer) {
    var c = this.input[this.pointer];
    var cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

    // exec state machine
    var ret = this["parse ".concat(this.state)](c, cStr);
    if (!ret) {
      break; // terminate algorithm
    } else if (ret === failure$1) {
      this.failure = true;
      break;
    }
  }
}
URLStateMachine.prototype.validateURLUnit = function (c) {
  if (this.validationErrors === null) {
    return;
  }
  if (isInvalidURLCodePoint$1(c)) {
    this.validationErrors.push("invalid-URL-unit");
  }
  if (isInvalidPercentEncoding(this.input, this.pointer)) {
    this.validationErrors.push("invalid-URL-unit");
  }
};
URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
  if (infra$2.isASCIIAlpha(c)) {
    this.buffer += cStr.toLowerCase();
    this.state = "scheme";
  } else if (!this.stateOverride) {
    this.state = "no scheme";
    --this.pointer;
  } else {
    return failure$1;
  }
  return true;
};
URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
  if (infra$2.isASCIIAlphanumeric(c) || c === p$2("+") || c === p$2("-") || c === p$2(".")) {
    this.buffer += cStr.toLowerCase();
  } else if (c === p$2(":")) {
    if (this.stateOverride) {
      if (isSpecial(this.url) && !isSpecialScheme$1(this.buffer)) {
        return false;
      }
      if (!isSpecial(this.url) && isSpecialScheme$1(this.buffer)) {
        return false;
      }
      if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
        return false;
      }
      if (this.url.scheme === "file" && this.url.host === "") {
        return false;
      }
    }
    this.url.scheme = this.buffer;
    if (this.stateOverride) {
      if (this.url.port === defaultPort$1(this.url.scheme)) {
        this.url.port = null;
      }
      return false;
    }
    this.buffer = "";
    if (this.url.scheme === "file") {
      if (this.input[this.pointer + 1] !== p$2("/") || this.input[this.pointer + 2] !== p$2("/")) {
        var _this$validationError3;
        (_this$validationError3 = this.validationErrors) === null || _this$validationError3 === void 0 || _this$validationError3.push("special-scheme-missing-following-solidus");
      }
      this.state = "file";
    } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
      this.state = "special relative or authority";
    } else if (isSpecial(this.url)) {
      this.state = "special authority slashes";
    } else if (this.input[this.pointer + 1] === p$2("/")) {
      this.state = "path or authority";
      ++this.pointer;
    } else {
      this.url.path = "";
      this.state = "opaque path";
    }
  } else if (!this.stateOverride) {
    this.buffer = "";
    this.state = "no scheme";
    this.pointer = -1;
  } else {
    return failure$1;
  }
  return true;
};
URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
  if (this.base === null || hasAnOpaquePath(this.base) && c !== p$2("#")) {
    var _this$validationError4;
    (_this$validationError4 = this.validationErrors) === null || _this$validationError4 === void 0 || _this$validationError4.push("missing-scheme-non-relative-URL");
    return failure$1;
  } else if (hasAnOpaquePath(this.base) && c === p$2("#")) {
    this.url.scheme = this.base.scheme;
    this.url.path = this.base.path;
    this.url.query = this.base.query;
    this.url.fragment = "";
    this.state = "fragment";
  } else if (this.base.scheme === "file") {
    this.state = "file";
    --this.pointer;
  } else {
    this.state = "relative";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
  if (c === p$2("/") && this.input[this.pointer + 1] === p$2("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    var _this$validationError5;
    (_this$validationError5 = this.validationErrors) === null || _this$validationError5 === void 0 || _this$validationError5.push("special-scheme-missing-following-solidus");
    this.state = "relative";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
  if (c === p$2("/")) {
    this.state = "authority";
  } else {
    this.state = "path";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
  this.url.scheme = this.base.scheme;
  if (c === p$2("/")) {
    this.state = "relative slash";
  } else if (isSpecial(this.url) && c === p$2("\\")) {
    var _this$validationError6;
    (_this$validationError6 = this.validationErrors) === null || _this$validationError6 === void 0 || _this$validationError6.push("invalid-reverse-solidus");
    this.state = "relative slash";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p$2("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p$2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      this.url.path.pop();
      this.state = "path";
      --this.pointer;
    }
  }
  return true;
};
URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
  if (isSpecial(this.url) && (c === p$2("/") || c === p$2("\\"))) {
    if (c === p$2("\\")) {
      var _this$validationError7;
      (_this$validationError7 = this.validationErrors) === null || _this$validationError7 === void 0 || _this$validationError7.push("invalid-reverse-solidus");
    }
    this.state = "special authority ignore slashes";
  } else if (c === p$2("/")) {
    this.state = "authority";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.state = "path";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
  if (c === p$2("/") && this.input[this.pointer + 1] === p$2("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    var _this$validationError8;
    (_this$validationError8 = this.validationErrors) === null || _this$validationError8 === void 0 || _this$validationError8.push("special-scheme-missing-following-solidus");
    this.state = "special authority ignore slashes";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
  if (c !== p$2("/") && c !== p$2("\\")) {
    this.state = "authority";
    --this.pointer;
  } else {
    var _this$validationError9;
    (_this$validationError9 = this.validationErrors) === null || _this$validationError9 === void 0 || _this$validationError9.push("special-scheme-missing-following-solidus");
  }
  return true;
};
URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
  if (c === p$2("@")) {
    var _this$validationError0;
    (_this$validationError0 = this.validationErrors) === null || _this$validationError0 === void 0 || _this$validationError0.push("invalid-credentials");
    if (this.atSignSeen) {
      this.buffer = "%40".concat(this.buffer);
    }
    this.atSignSeen = true;

    // careful, this iterates over the buffer's code points, independently of this.pointer
    var _iterator2 = _createForOfIteratorHelper(this.buffer),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var codePointStr = _step2.value;
        var codePoint = codePointStr.codePointAt(0);
        if (codePoint === p$2(":") && !this.passwordTokenSeen) {
          this.passwordTokenSeen = true;
          continue;
        }
        var encodedCodePoints = utf8PercentEncodeCodePoint$1(codePoint, isUserinfoPercentEncode$1);
        if (this.passwordTokenSeen) {
          this.url.password += encodedCodePoints;
        } else {
          this.url.username += encodedCodePoints;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    this.buffer = "";
  } else if (isNaN(c) || c === p$2("/") || c === p$2("?") || c === p$2("#") || isSpecial(this.url) && c === p$2("\\")) {
    if (this.atSignSeen && this.buffer === "") {
      var _this$validationError1;
      (_this$validationError1 = this.validationErrors) === null || _this$validationError1 === void 0 || _this$validationError1.push("host-missing");
      return failure$1;
    }
    this.pointer -= countSymbols(this.buffer) + 1;
    this.buffer = "";
    this.state = "host";
  } else {
    this.buffer += cStr;
  }
  return true;
};
URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
  if (this.stateOverride && this.url.scheme === "file") {
    --this.pointer;
    this.state = "file host";
  } else if (c === p$2(":") && !this.insideBrackets) {
    if (this.buffer === "") {
      var _this$validationError10;
      (_this$validationError10 = this.validationErrors) === null || _this$validationError10 === void 0 || _this$validationError10.push("host-missing");
      return failure$1;
    }
    if (this.stateOverride === "hostname") {
      return failure$1;
    }
    var host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
    if (host === failure$1) {
      return failure$1;
    }
    this.url.host = host;
    this.buffer = "";
    this.state = "port";
  } else if (isNaN(c) || c === p$2("/") || c === p$2("?") || c === p$2("#") || isSpecial(this.url) && c === p$2("\\")) {
    --this.pointer;
    if (isSpecial(this.url) && this.buffer === "") {
      var _this$validationError11;
      (_this$validationError11 = this.validationErrors) === null || _this$validationError11 === void 0 || _this$validationError11.push("host-missing");
      return failure$1;
    } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
      return failure$1;
    }
    var _host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
    if (_host === failure$1) {
      return failure$1;
    }
    this.url.host = _host;
    this.buffer = "";
    this.state = "path start";
    if (this.stateOverride) {
      return false;
    }
  } else {
    if (c === p$2("[")) {
      this.insideBrackets = true;
    } else if (c === p$2("]")) {
      this.insideBrackets = false;
    }
    this.buffer += cStr;
  }
  return true;
};
URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
  if (infra$2.isASCIIDigit(c)) {
    this.buffer += cStr;
  } else if (isNaN(c) || c === p$2("/") || c === p$2("?") || c === p$2("#") || isSpecial(this.url) && c === p$2("\\") || this.stateOverride) {
    if (this.buffer !== "") {
      var port = parseInt(this.buffer, 10);
      if (port > Math.pow(2, 16) - 1) {
        var _this$validationError12;
        (_this$validationError12 = this.validationErrors) === null || _this$validationError12 === void 0 || _this$validationError12.push("port-out-of-range");
        return failure$1;
      }
      this.url.port = port === defaultPort$1(this.url.scheme) ? null : port;
      this.buffer = "";
      if (this.stateOverride) {
        return false;
      }
    }
    if (this.stateOverride) {
      return failure$1;
    }
    this.state = "path start";
    --this.pointer;
  } else {
    var _this$validationError13;
    (_this$validationError13 = this.validationErrors) === null || _this$validationError13 === void 0 || _this$validationError13.push("port-invalid");
    return failure$1;
  }
  return true;
};
var fileOtherwiseCodePoints = new Set([p$2("/"), p$2("\\"), p$2("?"), p$2("#")]);
function startsWithWindowsDriveLetter(input, pointer) {
  var length = input.length - pointer;
  return length >= 2 && isWindowsDriveLetterCodePoints$1(input[pointer], input[pointer + 1]) && (length === 2 || fileOtherwiseCodePoints.has(input[pointer + 2]));
}
URLStateMachine.prototype["parse file"] = function parseFile(c) {
  this.url.scheme = "file";
  this.url.host = "";
  if (c === p$2("/") || c === p$2("\\")) {
    if (c === p$2("\\")) {
      var _this$validationError14;
      (_this$validationError14 = this.validationErrors) === null || _this$validationError14 === void 0 || _this$validationError14.push("invalid-reverse-solidus");
    }
    this.state = "file slash";
  } else if (this.base !== null && this.base.scheme === "file") {
    this.url.host = this.base.host;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p$2("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p$2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      if (!startsWithWindowsDriveLetter(this.input, this.pointer)) {
        shortenPath(this.url);
      } else {
        var _this$validationError15;
        (_this$validationError15 = this.validationErrors) === null || _this$validationError15 === void 0 || _this$validationError15.push("file-invalid-Windows-drive-letter");
        this.url.path = [];
      }
      this.state = "path";
      --this.pointer;
    }
  } else {
    this.state = "path";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
  if (c === p$2("/") || c === p$2("\\")) {
    if (c === p$2("\\")) {
      var _this$validationError16;
      (_this$validationError16 = this.validationErrors) === null || _this$validationError16 === void 0 || _this$validationError16.push("invalid-reverse-solidus");
    }
    this.state = "file host";
  } else {
    if (this.base !== null && this.base.scheme === "file") {
      if (!startsWithWindowsDriveLetter(this.input, this.pointer) && isNormalizedWindowsDriveLetterString$1(this.base.path[0])) {
        this.url.path.push(this.base.path[0]);
      }
      this.url.host = this.base.host;
    }
    this.state = "path";
    --this.pointer;
  }
  return true;
};
URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
  if (isNaN(c) || c === p$2("/") || c === p$2("\\") || c === p$2("?") || c === p$2("#")) {
    --this.pointer;
    if (!this.stateOverride && isWindowsDriveLetterString$1(this.buffer)) {
      var _this$validationError17;
      (_this$validationError17 = this.validationErrors) === null || _this$validationError17 === void 0 || _this$validationError17.push("file-invalid-Windows-drive-letter-host");
      this.state = "path";
    } else if (this.buffer === "") {
      this.url.host = "";
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
    } else {
      var host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
      if (host === failure$1) {
        return failure$1;
      }
      if (host === "localhost") {
        host = "";
      }
      this.url.host = host;
      if (this.stateOverride) {
        return false;
      }
      this.buffer = "";
      this.state = "path start";
    }
  } else {
    this.buffer += cStr;
  }
  return true;
};
URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
  if (isSpecial(this.url)) {
    if (c === p$2("\\")) {
      var _this$validationError18;
      (_this$validationError18 = this.validationErrors) === null || _this$validationError18 === void 0 || _this$validationError18.push("invalid-reverse-solidus");
    }
    this.state = "path";
    if (c !== p$2("/") && c !== p$2("\\")) {
      --this.pointer;
    }
  } else if (!this.stateOverride && c === p$2("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (!this.stateOverride && c === p$2("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c !== undefined) {
    this.state = "path";
    if (c !== p$2("/")) {
      --this.pointer;
    }
  } else if (this.stateOverride && this.url.host === null) {
    this.url.path.push("");
  }
  return true;
};
URLStateMachine.prototype["parse path"] = function parsePath(c) {
  if (isNaN(c) || c === p$2("/") || isSpecial(this.url) && c === p$2("\\") || !this.stateOverride && (c === p$2("?") || c === p$2("#"))) {
    if (isSpecial(this.url) && c === p$2("\\")) {
      var _this$validationError19;
      (_this$validationError19 = this.validationErrors) === null || _this$validationError19 === void 0 || _this$validationError19.push("invalid-reverse-solidus");
    }
    if (isDoubleDot(this.buffer)) {
      shortenPath(this.url);
      if (c !== p$2("/") && !(isSpecial(this.url) && c === p$2("\\"))) {
        this.url.path.push("");
      }
    } else if (isSingleDot(this.buffer) && c !== p$2("/") && !(isSpecial(this.url) && c === p$2("\\"))) {
      this.url.path.push("");
    } else if (!isSingleDot(this.buffer)) {
      if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString$1(this.buffer)) {
        this.buffer = "".concat(this.buffer[0], ":");
      }
      this.url.path.push(this.buffer);
    }
    this.buffer = "";
    if (c === p$2("?")) {
      this.url.query = "";
      this.state = "query";
    }
    if (c === p$2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else {
    this.validateURLUnit(c);
    this.buffer += utf8PercentEncodeCodePoint$1(c, isPathPercentEncode$1);
  }
  return true;
};
URLStateMachine.prototype["parse opaque path"] = function parseOpaquePath(c) {
  if (c === p$2("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (c === p$2("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c === p$2(" ")) {
    var _this$validationError20;
    (_this$validationError20 = this.validationErrors) === null || _this$validationError20 === void 0 || _this$validationError20.push("invalid-URL-unit");
    var remaining = this.input[this.pointer + 1];
    if (remaining === p$2("?") || remaining === p$2("#")) {
      this.url.path += "%20";
    } else {
      this.url.path += " ";
    }
  } else if (!isNaN(c)) {
    this.validateURLUnit(c);
    this.url.path += utf8PercentEncodeCodePoint$1(c, isC0ControlPercentEncode$1);
  }
  return true;
};
URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
  if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
    this.encoding = "utf-8";
  }
  if (!this.stateOverride && c === p$2("#") || isNaN(c)) {
    var percentEncodeSet = isSpecial(this.url) ? extraSpecialQueryPercentEncodeChars$1 : extraQueryPercentEncodeChars$1;
    this.url.query += percentEncodeAfterEncoding(this.encoding, this.buffer, percentEncodeSet);
    this.buffer = "";
    if (c === p$2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else if (!isNaN(c)) {
    this.validateURLUnit(c);
    this.buffer += cStr;
  }
  return true;
};
URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
  if (!isNaN(c)) {
    this.validateURLUnit(c);
    this.url.fragment += utf8PercentEncodeCodePoint$1(c, isFragmentPercentEncode$1);
  }
  return true;
};
function serializeURL(url, excludeFragment) {
  var output = "".concat(url.scheme, ":");
  if (url.host !== null) {
    output += "//";
    if (url.username !== "" || url.password !== "") {
      output += url.username;
      if (url.password !== "") {
        output += ":".concat(url.password);
      }
      output += "@";
    }
    output += serializeHost(url.host);
    if (url.port !== null) {
      output += ":".concat(url.port);
    }
  }
  if (url.host === null && !hasAnOpaquePath(url) && url.path.length > 1 && url.path[0] === "") {
    output += "/.";
  }
  output += serializePath(url);
  if (url.query !== null) {
    output += "?".concat(url.query);
  }
  if (!excludeFragment && url.fragment !== null) {
    output += "#".concat(url.fragment);
  }
  return output;
}
function serializeOrigin(tuple) {
  var result = "".concat(tuple.scheme, "://");
  result += serializeHost(tuple.host);
  if (tuple.port !== null) {
    result += ":".concat(tuple.port);
  }
  return result;
}
function serializePath(url) {
  if (hasAnOpaquePath(url)) {
    return url.path;
  }
  var output = "";
  var _iterator3 = _createForOfIteratorHelper(url.path),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var segment = _step3.value;
      output += "/".concat(segment);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return output;
}
module.exports.serializeURL = serializeURL;
module.exports.serializePath = serializePath;
module.exports.serializeURLOrigin = function (url) {
  // https://url.spec.whatwg.org/#concept-url-origin
  switch (url.scheme) {
    case "blob":
      {
        var pathURL = module.exports.parseURL(serializePath(url));
        if (pathURL === null) {
          return "null";
        }
        if (pathURL.scheme !== "http" && pathURL.scheme !== "https") {
          return "null";
        }
        return module.exports.serializeURLOrigin(pathURL);
      }
    case "ftp":
    case "http":
    case "https":
    case "ws":
    case "wss":
      return serializeOrigin({
        scheme: url.scheme,
        host: url.host,
        port: url.port
      });
    case "file":
      // The spec says:
      // > Unfortunate as it is, this is left as an exercise to the reader. When in doubt, return a new opaque origin.
      // Browsers tested so far:
      // - Chrome says "file://", but treats file: URLs as cross-origin for most (all?) purposes; see e.g.
      //   https://bugs.chromium.org/p/chromium/issues/detail?id=37586
      // - Firefox says "null", but treats file: URLs as same-origin sometimes based on directory stuff; see
      //   https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Same-origin_policy_for_file:_URIs
      return "null";
    default:
      // serializing an opaque origin returns "null"
      return "null";
  }
};
function basicURLParse(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var validationErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var usm = new URLStateMachine(input, options.baseURL, options.encoding, options.url, options.stateOverride, validationErrors);
  if (usm.failure) {
    return null;
  }
  return usm.url;
}
module.exports.basicURLParse = function (input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return basicURLParse(input, options);
};
module.exports.setTheUsername = function (url, username) {
  url.username = utf8PercentEncodeString$1(username, isUserinfoPercentEncode$1);
};
module.exports.setThePassword = function (url, password) {
  url.password = utf8PercentEncodeString$1(password, isUserinfoPercentEncode$1);
};
module.exports.serializeHost = serializeHost;
module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
module.exports.hasAnOpaquePath = hasAnOpaquePath;
module.exports.serializeInteger = function (integer) {
  return String(integer);
};
module.exports.parseURL = function (input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // We don't handle blobs, so this just delegates:
  return module.exports.basicURLParse(input, {
    baseURL: options.baseURL,
    encoding: options.encoding
  });
};
module.exports.parseURLWithValidationErrors = function (input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var validationErrors = [];

  // We don't handle blobs, so this just delegates:
  var url = basicURLParse(input, {
    baseURL: options.baseURL,
    encoding: options.encoding
  }, validationErrors);
  return {
    url: url,
    validationErrors: validationErrors
  };
};

var urlStateMachine = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(urlStateMachine);

var _require$1 = require("./infra"),
  isASCIIHex = _require$1.isASCIIHex;
var _require2 = require("./encoding"),
  utf8Encode = _require2.utf8Encode;
function p$1(_char) {
  return _char.codePointAt(0);
}

// https://url.spec.whatwg.org/#percent-encode
function percentEncode(c) {
  var hex = c.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = "0".concat(hex);
  }
  return "%".concat(hex);
}

// https://url.spec.whatwg.org/#percent-decode
function percentDecodeBytes(input) {
  var output = new Uint8Array(input.byteLength);
  var outputIndex = 0;
  for (var i = 0; i < input.byteLength; ++i) {
    var _byte = input[i];
    if (_byte !== 0x25) {
      output[outputIndex++] = _byte;
    } else if (_byte === 0x25 && (!isASCIIHex(input[i + 1]) || !isASCIIHex(input[i + 2]))) {
      output[outputIndex++] = _byte;
    } else {
      var bytePoint = parseInt(String.fromCodePoint(input[i + 1], input[i + 2]), 16);
      output[outputIndex++] = bytePoint;
      i += 2;
    }
  }
  return output.slice(0, outputIndex);
}

// https://url.spec.whatwg.org/#string-percent-decode
function percentDecodeString(input) {
  var bytes = utf8Encode(input);
  return percentDecodeBytes(bytes);
}

// https://url.spec.whatwg.org/#c0-control-percent-encode-set
function isC0ControlPercentEncode(c) {
  return c <= 0x1F || c > 0x7E;
}

// https://url.spec.whatwg.org/#fragment-percent-encode-set
var extraFragmentPercentEncodeSet = new Set([p$1(" "), p$1("\""), p$1("<"), p$1(">"), p$1("`")]);
function isFragmentPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraFragmentPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#query-percent-encode-set
var extraQueryPercentEncodeSet = new Set([p$1(" "), p$1("\""), p$1("#"), p$1("<"), p$1(">")]);
var extraQueryPercentEncodeChars = String.fromCodePoint.apply(String, _toConsumableArray(_toConsumableArray(extraQueryPercentEncodeSet).sort()));
function isQueryPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraQueryPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#special-query-percent-encode-set
var extraSpecialQueryPercentEncodeSet = new Set([].concat(_toConsumableArray(extraQueryPercentEncodeSet), [p$1("'")]));
var extraSpecialQueryPercentEncodeChars = String.fromCodePoint.apply(String, _toConsumableArray(_toConsumableArray(extraSpecialQueryPercentEncodeSet).sort()));
function isSpecialQueryPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraSpecialQueryPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#path-percent-encode-set
var extraPathPercentEncodeSet = new Set([p$1("?"), p$1("`"), p$1("{"), p$1("}"), p$1("^")]);
function isPathPercentEncode(c) {
  return isQueryPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#userinfo-percent-encode-set
var extraUserinfoPercentEncodeSet = new Set([p$1("/"), p$1(":"), p$1(";"), p$1("="), p$1("@"), p$1("["), p$1("\\"), p$1("]"), p$1("|")]);
function isUserinfoPercentEncode(c) {
  return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#component-percent-encode-set
var extraComponentPercentEncodeSet = new Set([p$1("$"), p$1("%"), p$1("&"), p$1("+"), p$1(",")]);
function isComponentPercentEncode(c) {
  return isUserinfoPercentEncode(c) || extraComponentPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#application-x-www-form-urlencoded-percent-encode-set
var extraURLEncodedPercentEncodeSet = new Set([p$1("!"), p$1("'"), p$1("("), p$1(")"), p$1("~")]);
function isURLEncodedPercentEncode(c) {
  return isComponentPercentEncode(c) || extraURLEncodedPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#code-point-percent-encode-after-encoding
// https://url.spec.whatwg.org/#utf-8-percent-encode
// Assuming encoding is always utf-8 allows us to trim one of the logic branches. TODO: support encoding.
// The "-Internal" variant here has code points as JS strings. The external version used by other files has code points
// as JS numbers, like the rest of the codebase.
function utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate) {
  var bytes = utf8Encode(codePoint);
  var output = "";
  var _iterator = _createForOfIteratorHelper(bytes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _byte2 = _step.value;
      // Our percentEncodePredicate operates on bytes, not code points, so this is slightly different from the spec.
      if (!percentEncodePredicate(_byte2)) {
        output += String.fromCharCode(_byte2);
      } else {
        output += percentEncode(_byte2);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return output;
}
function utf8PercentEncodeCodePoint(codePoint, percentEncodePredicate) {
  return utf8PercentEncodeCodePointInternal(String.fromCodePoint(codePoint), percentEncodePredicate);
}

// https://url.spec.whatwg.org/#string-percent-encode-after-encoding
// https://url.spec.whatwg.org/#string-utf-8-percent-encode
function utf8PercentEncodeString(input, percentEncodePredicate) {
  var spaceAsPlus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var output = "";
  var _iterator2 = _createForOfIteratorHelper(input),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var codePoint = _step2.value;
      if (spaceAsPlus && codePoint === " ") {
        output += "+";
      } else {
        output += utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return output;
}
module.exports = {
  isC0ControlPercentEncode: isC0ControlPercentEncode,
  isFragmentPercentEncode: isFragmentPercentEncode,
  isQueryPercentEncode: isQueryPercentEncode,
  isSpecialQueryPercentEncode: isSpecialQueryPercentEncode,
  isPathPercentEncode: isPathPercentEncode,
  isUserinfoPercentEncode: isUserinfoPercentEncode,
  isURLEncodedPercentEncode: isURLEncodedPercentEncode,
  extraQueryPercentEncodeChars: extraQueryPercentEncodeChars,
  extraSpecialQueryPercentEncodeChars: extraSpecialQueryPercentEncodeChars,
  percentDecodeString: percentDecodeString,
  percentDecodeBytes: percentDecodeBytes,
  utf8PercentEncodeString: utf8PercentEncodeString,
  utf8PercentEncodeCodePoint: utf8PercentEncodeCodePoint
};

var percentEncoding = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$2 = /*@__PURE__*/getAugmentedNamespace(percentEncoding);

var infra$1;
var hasRequiredInfra;

function requireInfra () {
	if (hasRequiredInfra) return infra$1;
	hasRequiredInfra = 1;

	// Note that we take code points as JS numbers, not JS strings.
	function isASCIIDigit(c) {
	  return c >= 0x30 && c <= 0x39;
	}
	function isASCIIAlpha(c) {
	  return c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A;
	}
	function isASCIIAlphanumeric(c) {
	  return isASCIIAlpha(c) || isASCIIDigit(c);
	}
	function isASCIIHex(c) {
	  return isASCIIDigit(c) || c >= 0x41 && c <= 0x46 || c >= 0x61 && c <= 0x66;
	}
	function isASCIIString(string) {
	  return !/(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/.test(string);
	}
	function isNoncharacter(c) {
	  return c >= 0xFDD0 && c <= 0xFDEF || (c & 0xFFFE) === 0xFFFE;
	}
	infra$1 = {
	  isASCIIDigit: isASCIIDigit,
	  isASCIIAlpha: isASCIIAlpha,
	  isASCIIAlphanumeric: isASCIIAlphanumeric,
	  isASCIIHex: isASCIIHex,
	  isASCIIString: isASCIIString,
	  isNoncharacter: isNoncharacter
	};
	return infra$1;
}

var tr46 = require("tr46");
var infra = require("./infra");
function p(_char) {
  return _char.codePointAt(0);
}
var failure = Symbol("failure");
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};
var urlCodePoints = new Set([p("!"), p("$"), p("&"), p("'"), p("("), p(")"), p("*"), p("+"), p(","), p("-"), p("."), p("/"), p(":"), p(";"), p("="), p("?"), p("@"), p("_"), p("~")]);
var forbiddenHostCodePoints = new Set([0x00, 0x09, 0x0A, 0x0D, 0x20, p("#"), p("/"), p(":"), p("<"), p(">"), p("?"), p("@"), p("["), p("\\"), p("]"), p("^"), p("|")]);
function isURLCodePoint(c) {
  return infra.isASCIIAlphanumeric(c) || urlCodePoints.has(c) || c >= 0xA0 && c <= 0x10FFFD && (c < 0xD800 || c > 0xDFFF) && !infra.isNoncharacter(c);
}
function isInvalidURLCodePoint(c) {
  return !isURLCodePoint(c) && c !== p("%");
}
function isPercentEncodedByteAt(input, index) {
  return index + 2 < input.length && input[index] === "%" && infra.isASCIIHex(input.charCodeAt(index + 1)) && infra.isASCIIHex(input.charCodeAt(index + 2));
}
function containsPercentEncodedByte(input) {
  return /%[0-9A-Fa-f]{2}/.test(input);
}
function containsForbiddenHostCodePoint(string) {
  return _toConsumableArray(string).some(function (c) {
    return forbiddenHostCodePoints.has(c.codePointAt(0));
  });
}
function containsForbiddenDomainCodePoint(string) {
  return _toConsumableArray(string).some(function (c) {
    var cp = c.codePointAt(0);
    return forbiddenHostCodePoints.has(cp) || cp >= 0x00 && cp <= 0x1F || cp === p("%") || cp === 0x7F;
  });
}
function domainParserToASCII(domain, beStrict) {
  return tr46.toASCII(domain, {
    checkHyphens: beStrict,
    checkBidi: true,
    checkJoiners: true,
    useSTD3ASCIIRules: beStrict,
    transitionalProcessing: false,
    verifyDNSLength: beStrict,
    ignoreInvalidPunycode: false
  });
}
function parseIPv4Number(input) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (input === "") {
    return failure;
  }
  var validationErrorSeen = false;
  var R = 10;
  if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
    validationErrorSeen = true;
    input = input.substring(2);
    R = 16;
  } else if (input.length >= 2 && input.charAt(0) === "0") {
    validationErrorSeen = true;
    input = input.substring(1);
    R = 8;
  }
  if (input === "") {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-non-decimal-part");
    return 0;
  }
  var regex = /(?:[\0-\/8-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
  if (R === 10) {
    regex = /(?:[\0-\/:-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
  }
  if (R === 16) {
    regex = /(?:[\0-\/:-@G-`g-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
  }
  if (regex.test(input)) {
    return failure;
  }
  if (validationErrorSeen) {
    validationErrors === null || validationErrors === void 0 || validationErrors.push("IPv4-non-decimal-part");
  }
  return parseInt(input, R);
}
function endsInANumber(input) {
  var parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    if (parts.length === 1) {
      return false;
    }
    parts.pop();
  }
  var last = parts[parts.length - 1];
  if (/^[0-9]+$/.test(last)) {
    return true;
  }
  if (parseIPv4Number(last) !== failure) {
    return true;
  }
  return false;
}
function domainParser(domain) {
  var validationErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var beStrict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // A domain-to-ASCII validation error is reported whenever the strict Unicode ToASCII (CheckHyphens,
  // UseSTD3ASCIIRules, and VerifyDnsLength all true) fails, even when the relaxed parameters used
  // for non-strict parsing succeed. This step does not itself fail the algorithm.
  //
  // Spec divergence (performance): the URL Standard runs this strict pass unconditionally, but when
  // beStrict is false its only effect is that validation error, so we skip it when we are neither
  // being strict nor collecting validation errors.
  if (beStrict || validationErrors) {
    var strictResult = domainParserToASCII(domain, true);
    if (strictResult === null) {
      validationErrors === null || validationErrors === void 0 || validationErrors.push("domain-to-ASCII");
    }
    if (beStrict) {
      return strictResult === null ? failure : strictResult;
    }
  }
  var result;
  if (infra.isASCIIString(domain)) {
    // For web compatibility an ASCII domain is returned lowercased regardless of ToASCII's outcome.
    result = domain.toLowerCase();
  } else {
    result = domainParserToASCII(domain, false);
    if (result === null) {
      return failure;
    }
  }
  if (result === "") {
    return failure;
  }
  if (containsForbiddenDomainCodePoint(result)) {
    return failure;
  }
  return result;
}
function isSpecialScheme(scheme) {
  return specialSchemes[scheme.toLowerCase()] !== undefined;
}
function isSpecialSchemeExceptFile(scheme) {
  return isSpecialScheme(scheme) && scheme.toLowerCase() !== "file";
}
function defaultPort(scheme) {
  return specialSchemes[scheme.toLowerCase()];
}
function isWindowsDriveLetterCodePoints(cp1, cp2) {
  return infra.isASCIIAlpha(cp1) && (cp2 === p(":") || cp2 === p("|"));
}
function isWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}
function isNormalizedWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}
module.exports = {
  containsForbiddenHostCodePoint: containsForbiddenHostCodePoint,
  containsPercentEncodedByte: containsPercentEncodedByte,
  defaultPort: defaultPort,
  domainParser: domainParser,
  endsInANumber: endsInANumber,
  failure: failure,
  forbiddenHostCodePoints: forbiddenHostCodePoints,
  isInvalidURLCodePoint: isInvalidURLCodePoint,
  isNormalizedWindowsDriveLetterString: isNormalizedWindowsDriveLetterString,
  isPercentEncodedByteAt: isPercentEncodedByteAt,
  parseIPv4Number: parseIPv4Number,
  isSpecialScheme: isSpecialScheme,
  isSpecialSchemeExceptFile: isSpecialSchemeExceptFile,
  isURLCodePoint: isURLCodePoint,
  isWindowsDriveLetterCodePoints: isWindowsDriveLetterCodePoints,
  isWindowsDriveLetterString: isWindowsDriveLetterString,
  p: p
};

var urlMiscellaneous = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(urlMiscellaneous);

var urlStringValidator;
var hasRequiredUrlStringValidator;

function requireUrlStringValidator () {
	if (hasRequiredUrlStringValidator) return urlStringValidator;
	hasRequiredUrlStringValidator = 1;

	var infra = requireInfra();
	var _require = require$$1,
	  domainParser = _require.domainParser,
	  endsInANumber = _require.endsInANumber,
	  failure = _require.failure,
	  forbiddenHostCodePoints = _require.forbiddenHostCodePoints,
	  isPercentEncodedByteAt = _require.isPercentEncodedByteAt,
	  isSpecialSchemeExceptFile = _require.isSpecialSchemeExceptFile,
	  isURLCodePoint = _require.isURLCodePoint,
	  p = _require.p;
	var _require2 = require$$1$1,
	  hasAnOpaquePath = _require2.hasAnOpaquePath;
	var pathSegmentExcludedCodePoints = new Set([p("/"), p("?")]);
	var opaquePathExcludedCodePoints = new Set([p("?")]);
	function splitOffFragment(input) {
	  var fragmentStart = input.indexOf("#");
	  if (fragmentStart === -1) {
	    return {
	      beforeFragment: input,
	      fragment: null
	    };
	  }
	  return {
	    beforeFragment: input.substring(0, fragmentStart),
	    fragment: input.substring(fragmentStart + 1)
	  };
	}
	function splitOffQuery(input) {
	  var queryStart = input.indexOf("?");
	  if (queryStart === -1) {
	    return {
	      beforeQuery: input,
	      query: null
	    };
	  }
	  return {
	    beforeQuery: input.substring(0, queryStart),
	    query: input.substring(queryStart + 1)
	  };
	}
	function isValidURLString(input) {
	  var _options$baseURL;
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var baseURL = (_options$baseURL = options.baseURL) !== null && _options$baseURL !== void 0 ? _options$baseURL : null;
	  return isValidAbsoluteURLWithFragmentString(input) || baseURL !== null && isValidRelativeURLWithFragmentString(input, baseURL);
	}
	function isValidAbsoluteURLWithFragmentString(input) {
	  var _splitOffFragment = splitOffFragment(input),
	    beforeFragment = _splitOffFragment.beforeFragment,
	    fragment = _splitOffFragment.fragment;
	  return (fragment === null || isValidURLFragmentString(fragment)) && isValidAbsoluteURLString(beforeFragment);
	}
	function isValidAbsoluteURLString(input) {
	  var _splitOffQuery = splitOffQuery(input),
	    beforeQuery = _splitOffQuery.beforeQuery,
	    query = _splitOffQuery.query;
	  if (query !== null && !isValidURLQueryString(query)) {
	    return false;
	  }
	  var schemeMatch = /^([A-Za-z][\+\x2D\.0-9A-Za-z]*):/.exec(beforeQuery);
	  if (schemeMatch === null) {
	    return false;
	  }
	  var scheme = schemeMatch[1].toLowerCase();
	  var afterScheme = beforeQuery.substring(schemeMatch[0].length);
	  if (isSpecialSchemeExceptFile(scheme)) {
	    return isValidSchemeRelativeSpecialURLString(afterScheme);
	  }
	  if (scheme === "file") {
	    return isValidSchemeRelativeFileURLString(afterScheme);
	  }
	  return isValidSchemeRelativeURLString(afterScheme) || isValidPathAbsoluteNonAuthorityURLString(afterScheme) || isValidOpaquePathURLString(afterScheme);
	}
	function isValidRelativeURLWithFragmentString(input, baseURL) {
	  if (hasAnOpaquePath(baseURL)) {
	    return input.startsWith("#") && isValidURLFragmentString(input.substring(1));
	  }
	  var _splitOffFragment2 = splitOffFragment(input),
	    beforeFragment = _splitOffFragment2.beforeFragment,
	    fragment = _splitOffFragment2.fragment;
	  return isValidRelativeURLString(beforeFragment, baseURL) && (fragment === null || isValidURLFragmentString(fragment));
	}
	function isValidRelativeURLString(input, baseURL) {
	  var _splitOffQuery2 = splitOffQuery(input),
	    beforeQuery = _splitOffQuery2.beforeQuery,
	    query = _splitOffQuery2.query;
	  var hasValidQuery = query === null || isValidURLQueryString(query);
	  if (isValidPathAbsoluteNonAuthorityURLString(beforeQuery)) {
	    return hasValidQuery;
	  }
	  if (isValidPathRelativeSchemeLessURLString(beforeQuery)) {
	    return hasValidQuery;
	  }
	  if (isSpecialSchemeExceptFile(baseURL.scheme)) {
	    return isValidSchemeRelativeSpecialURLString(beforeQuery) && hasValidQuery;
	  }
	  if (baseURL.scheme === "file") {
	    return isValidSchemeRelativeFileURLString(beforeQuery) && hasValidQuery;
	  }
	  return isValidSchemeRelativeURLString(beforeQuery) && hasValidQuery;
	}
	function isValidSchemeRelativeSpecialURLString(input) {
	  if (!input.startsWith("//")) {
	    return false;
	  }
	  var _splitOffPath = splitOffPath(input.substring(2)),
	    authority = _splitOffPath.authority,
	    path = _splitOffPath.path;
	  return isValidHostAndPortString(authority, isValidHostString) && (path === null || isValidPathAbsoluteURLString(path));
	}
	function isValidSchemeRelativeURLString(input) {
	  if (!input.startsWith("//")) {
	    return false;
	  }
	  var _splitOffPath2 = splitOffPath(input.substring(2)),
	    authority = _splitOffPath2.authority,
	    path = _splitOffPath2.path;
	  return isValidOpaqueHostAndPortString(authority) && (path === null || isValidPathAbsoluteURLString(path));
	}
	function isValidSchemeRelativeFileURLString(input) {
	  if (!input.startsWith("//")) {
	    return false;
	  }
	  var afterSlashes = input.substring(2);
	  return afterSlashes === "" || isValidHostAndPathAbsoluteURLString(afterSlashes) || isValidPathAbsoluteURLString(afterSlashes);
	}
	function isValidHostAndPathAbsoluteURLString(input) {
	  var _splitOffPath3 = splitOffPath(input),
	    authority = _splitOffPath3.authority,
	    path = _splitOffPath3.path;
	  return isValidHostString(authority) && (path === null || isValidPathAbsoluteURLString(path));
	}
	function splitOffPath(input) {
	  var pathStart = input.indexOf("/");
	  if (pathStart === -1) {
	    return {
	      authority: input,
	      path: null
	    };
	  }
	  return {
	    authority: input.substring(0, pathStart),
	    path: input.substring(pathStart)
	  };
	}
	function isValidHostAndPortString(input, isValidHost) {
	  var parsed = splitHostAndPort(input);
	  return parsed !== null && parsed.host !== "" && isValidHost(parsed.host) && (parsed.port === null || isValidURLPortString(parsed.port));
	}
	function isValidOpaqueHostAndPortString(input) {
	  if (input === "") {
	    return true;
	  }
	  var parsed = splitHostAndPort(input);
	  return parsed !== null && parsed.host !== "" && isValidOpaqueHostString(parsed.host) && (parsed.port === null || isValidURLPortString(parsed.port));
	}
	function splitHostAndPort(input) {
	  if (input.startsWith("[")) {
	    var hostEnd = input.indexOf("]");
	    if (hostEnd === -1) {
	      return null;
	    }
	    var rest = input.substring(hostEnd + 1);
	    if (rest !== "" && !rest.startsWith(":")) {
	      return null;
	    }
	    return {
	      host: input.substring(0, hostEnd + 1),
	      port: rest === "" ? null : rest.substring(1)
	    };
	  }
	  var portStart = input.indexOf(":");
	  if (portStart === -1) {
	    return {
	      host: input,
	      port: null
	    };
	  }
	  return {
	    host: input.substring(0, portStart),
	    port: input.substring(portStart + 1)
	  };
	}
	function isValidHostString(input) {
	  return isValidDomainString(input) || isValidIPv4AddressString(input) || isValidBracketedIPv6AddressString(input);
	}
	function isValidDomainString(input) {
	  var domain = domainParser(input, null, true);
	  return domain !== failure && !endsInANumber(domain);
	}
	function isValidIPv4AddressString(input) {
	  var pieces = input.split(".");
	  return pieces.length === 4 && pieces.every(isValidIPv4AddressPieceString);
	}
	function isValidIPv4AddressPieceString(input) {
	  if (input === "" || input.length > 3) {
	    return false;
	  }
	  for (var i = 0; i < input.length; ++i) {
	    if (!infra.isASCIIDigit(input.codePointAt(i))) {
	      return false;
	    }
	  }
	  if (input.length > 1 && input[0] === "0") {
	    return false;
	  }
	  return Number(input) <= 255;
	}
	function isValidBracketedIPv6AddressString(input) {
	  return input.startsWith("[") && input.endsWith("]") && isValidIPv6AddressString(input.substring(1, input.length - 1));
	}
	function isValidIPv6AddressString(input) {
	  return getIPv6PiecesStringEffectiveLength(input) === 8 || getIPv6PiecesAndIPv4StringEffectiveLength(input) === 8 || isValidCompressedIPv6AddressString(input);
	}
	function isValidCompressedIPv6AddressString(input) {
	  var compressionIndex = input.indexOf("::");
	  if (compressionIndex === -1 || compressionIndex !== input.lastIndexOf("::")) {
	    return false;
	  }
	  var preceding = input.substring(0, compressionIndex);
	  var following = input.substring(compressionIndex + 2);
	  var precedingLength = getOptionalIPv6PiecesStringEffectiveLength(preceding);
	  var followingLength = getOptionalIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(following);
	  if (precedingLength === failure || followingLength === failure) {
	    return false;
	  }
	  return precedingLength + followingLength <= 7;
	}
	function getOptionalIPv6PiecesStringEffectiveLength(input) {
	  return input === "" ? 0 : getIPv6PiecesStringEffectiveLength(input);
	}
	function getOptionalIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input) {
	  return input === "" ? 0 : getIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input);
	}
	function getIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input) {
	  if (isValidIPv6PiecesString(input)) {
	    return getIPv6PiecesStringEffectiveLength(input);
	  }
	  if (isValidIPv6PiecesAndIPv4String(input)) {
	    return getIPv6PiecesAndIPv4StringEffectiveLength(input);
	  }
	  return failure;
	}
	function isValidIPv6PiecesAndIPv4String(input) {
	  if (isValidIPv4AddressString(input)) {
	    return true;
	  }
	  var ipv4SeparatorIndex = input.lastIndexOf(":");
	  if (ipv4SeparatorIndex === -1) {
	    return false;
	  }
	  return isValidIPv6PiecesString(input.substring(0, ipv4SeparatorIndex)) && isValidIPv4AddressString(input.substring(ipv4SeparatorIndex + 1));
	}
	function getIPv6PiecesAndIPv4StringEffectiveLength(input) {
	  if (!isValidIPv6PiecesAndIPv4String(input)) {
	    return failure;
	  }
	  var ipv4SeparatorIndex = input.lastIndexOf(":");
	  if (ipv4SeparatorIndex === -1) {
	    return 2;
	  }
	  var piecesLength = getIPv6PiecesStringEffectiveLength(input.substring(0, ipv4SeparatorIndex));
	  return piecesLength + 2;
	}
	function isValidIPv6PiecesString(input) {
	  if (input === "") {
	    return false;
	  }
	  var pieces = input.split(":");
	  return pieces.every(isValidIPv6PieceString);
	}
	function getIPv6PiecesStringEffectiveLength(input) {
	  return isValidIPv6PiecesString(input) ? input.split(":").length : failure;
	}
	function isValidIPv6PieceString(input) {
	  if (input === "" || input.length > 4) {
	    return false;
	  }
	  for (var i = 0; i < input.length; ++i) {
	    if (!infra.isASCIIHex(input.codePointAt(i))) {
	      return false;
	    }
	  }
	  var value = parseInt(input, 16);
	  return value <= 0xFFFF && (input.length === 1 || input[0] !== "0");
	}
	function isValidOpaqueHostString(input) {
	  return isValidBracketedIPv6AddressString(input) || input !== "" && isValidURLUnits(input, forbiddenHostCodePoints);
	}
	function isValidURLPortString(input) {
	  if (input === "") {
	    return true;
	  }
	  if (!/^[0-9]+$/.test(input)) {
	    return false;
	  }
	  return Number(input) <= 65535;
	}
	function isValidPathAbsoluteURLString(input) {
	  return input.startsWith("/") && input.substring(1).split("/").every(isValidURLPathSegmentString);
	}
	function isValidPathAbsoluteNonAuthorityURLString(input) {
	  return isValidPathAbsoluteURLString(input) && !input.startsWith("//");
	}
	function isValidPathRelativeURLString(input) {
	  return !input.startsWith("/") && input.split("/").every(isValidURLPathSegmentString);
	}
	function isValidURLPathSegmentString(input) {
	  return isValidURLUnits(input, pathSegmentExcludedCodePoints);
	}
	function isValidPathRelativeSchemeLessURLString(input) {
	  return isValidPathRelativeURLString(input) && !/^[A-Za-z][\+\x2D\.0-9A-Za-z]*:/.test(input);
	}
	function isValidOpaquePathURLString(input) {
	  return (input === "" || input[0] !== "/") && isValidURLUnits(input, opaquePathExcludedCodePoints);
	}
	function isValidURLQueryString(input) {
	  return isValidURLUnits(input);
	}
	function isValidURLFragmentString(input) {
	  return isValidURLUnits(input);
	}
	function isValidURLUnits(input) {
	  var excludedCodePoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
	  for (var i = 0; i < input.length;) {
	    if (input[i] === "%") {
	      if (!isPercentEncodedByteAt(input, i)) {
	        return false;
	      }
	      i += 3;
	      continue;
	    }
	    var codePoint = input.codePointAt(i);
	    if (!isURLCodePoint(codePoint) || excludedCodePoints.has(codePoint)) {
	      return false;
	    }
	    i += codePoint > 0xFFFF ? 2 : 1;
	  }
	  return true;
	}
	urlStringValidator = {
	  isValidURLString: isValidURLString
	};
	return urlStringValidator;
}

var hasRequiredWhatwgUrl;

function requireWhatwgUrl () {
	if (hasRequiredWhatwgUrl) return whatwgUrl;
	hasRequiredWhatwgUrl = 1;

	var _require = requireWebidl2jsWrapper(),
	  URL = _require.URL,
	  URLSearchParams = _require.URLSearchParams;
	var urlStateMachine = require$$1$1;
	var percentEncoding = require$$2;
	var urlStringValidator = requireUrlStringValidator();
	var sharedGlobalObject = {
	  Array: Array,
	  Object: Object,
	  Promise: Promise,
	  String: String,
	  TypeError: TypeError
	};
	URL.install(sharedGlobalObject, ["Window"]);
	URLSearchParams.install(sharedGlobalObject, ["Window"]);
	whatwgUrl.URL = sharedGlobalObject.URL;
	whatwgUrl.URLSearchParams = sharedGlobalObject.URLSearchParams;
	whatwgUrl.parseURL = urlStateMachine.parseURL;
	whatwgUrl.parseURLWithValidationErrors = urlStateMachine.parseURLWithValidationErrors;
	whatwgUrl.isValidURLString = urlStringValidator.isValidURLString;
	whatwgUrl.basicURLParse = urlStateMachine.basicURLParse;
	whatwgUrl.serializeURL = urlStateMachine.serializeURL;
	whatwgUrl.serializePath = urlStateMachine.serializePath;
	whatwgUrl.serializeHost = urlStateMachine.serializeHost;
	whatwgUrl.serializeInteger = urlStateMachine.serializeInteger;
	whatwgUrl.serializeURLOrigin = urlStateMachine.serializeURLOrigin;
	whatwgUrl.setTheUsername = urlStateMachine.setTheUsername;
	whatwgUrl.setThePassword = urlStateMachine.setThePassword;
	whatwgUrl.cannotHaveAUsernamePasswordPort = urlStateMachine.cannotHaveAUsernamePasswordPort;
	whatwgUrl.hasAnOpaquePath = urlStateMachine.hasAnOpaquePath;
	whatwgUrl.percentDecodeString = percentEncoding.percentDecodeString;
	whatwgUrl.percentDecodeBytes = percentEncoding.percentDecodeBytes;
	return whatwgUrl;
}

var whatwgUrlExports = requireWhatwgUrl();
var whatwgURL = /*@__PURE__*/getDefaultExportFromCjs(whatwgUrlExports);

/**
 * @todo We could use `import generateUUID from 'uuid/v4';` (but it needs
 *   crypto library, etc.; `rollup-plugin-node-builtins` doesn't recommend
 *   using its own version and though there is <https://www.npmjs.com/package/crypto-browserify>,
 *   it may be troublesome to bundle and not strongly needed)
 * @returns {string}
 */
function generateUUID() {
  //  Adapted from original: public domain/MIT: https://stackoverflow.com/a/8809472/271577
  /* c8 ignore next */
  var d = Date.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, function (c) {
    /* eslint-disable no-bitwise, sonarjs/pseudo-random -- Convenient */
    var r = Math.trunc((d + Math.random() * 16) % 16);
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    /* eslint-enable no-bitwise, sonarjs/pseudo-random -- Convenient */
  });
}

// @ts-nocheck -- Uses `Buffer`, which has no types without `@types/node`
//   (matches `URL.js`'s own `@ts-nocheck`, also Node-runtime-specific)
// Node's native `Blob`/`File` only expose their bytes asynchronously
//   (`.arrayBuffer()`/`.text()`/`.stream()`), with no standard synchronous
//   accessor. `xmlHttpRequestOverrideMimeType` (see `URL.js`) needs
//   synchronous access to back the `blob`/`file` types' synchronous
//   `replace()`. For jsdom's own `Blob`/`File`, it gets this via jsdom's
//   internal wrapper-unwrapping; for any other environment (e.g. Node
//   without jsdom, as in a worker thread with no DOM), these
//   `SyncBlob`/`SyncFile` subclasses provide the same synchronous access by
//   capturing a copy of the content as a `Buffer`, at construction time,
//   before handing the same `parts` off to the real, native constructor.
//
// The copy is kept in a module-private `WeakMap`, not as a property on the
//   instance: a plain (even non-enumerable) property would let any code
//   holding a reference to the `Blob`/`File` read its full raw content
//   synchronously, bypassing the normal, async-only `Blob`/`File` API --
//   and would risk leaking into `Object.keys()`/`JSON.stringify()`/etc. of
//   an object that's supposed to look like an ordinary `Blob`/`File`. Only
//   code that imports `getSyncBytes` from this same module can read it.

/**
 * @type {WeakMap<Blob, Buffer>}
 */
var syncBytesMap = new WeakMap();

/**
 * @param {Blob} blob A `SyncBlob`/`SyncFile` (or any `Blob`/`File` this
 *   module has otherwise recorded bytes for).
 * @returns {Buffer|undefined} `undefined` if `blob` isn't one this module
 *   has a synchronous copy for.
 */
function getSyncBytes(blob) {
  return syncBytesMap.get(blob);
}

/**
 * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} parts
 * @returns {Buffer}
 */
function partsToBuffer(parts) {
  return Buffer.concat(parts.map(function (part) {
    if (typeof part === 'string') {
      return Buffer.from(part, 'utf8');
    }
    if (Object.prototype.toString.call(part) === '[object ArrayBuffer]') {
      return Buffer.from(/** @type {ArrayBuffer} */part);
    }
    if (ArrayBuffer.isView(part)) {
      return Buffer.from(part.buffer, part.byteOffset, part.byteLength);
    }
    var partBytes = part && syncBytesMap.get(/** @type {Blob} */part);
    if (partBytes) {
      return partBytes;
    }
    return Buffer.from(String(part), 'utf8');
  }));
}

/**
 * A `Blob` subclass which also keeps a synchronously-readable copy of its
 *   content (accessible only via `getSyncBytes`, not as a property of the
 *   instance itself), for environments (e.g. Node without jsdom) where
 *   `Blob` alone offers no synchronous way to read it back.
 */
var SyncBlob = /*#__PURE__*/function (_Blob) {
  /**
   * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} [parts]
   * @param {BlobPropertyBag} [options]
   */
  // eslint-disable-next-line @stylistic/max-len -- Long
  // eslint-disable-next-line default-param-last -- Must match native `Blob` positionally
  function SyncBlob() {
    var _this;
    var parts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 ? arguments[1] : undefined;
    _classCallCheck(this, SyncBlob);
    _this = _callSuper(this, SyncBlob, [parts, options]);
    syncBytesMap.set(_this, partsToBuffer(parts));
    return _this;
  }
  _inherits(SyncBlob, _Blob);
  return _createClass(SyncBlob);
}(/*#__PURE__*/_wrapNativeSuper(Blob));
/**
 * `File` counterpart to `SyncBlob` -- see its documentation for why this
 *   exists.
 */
var SyncFile = /*#__PURE__*/function (_File) {
  /**
   * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} parts
   * @param {string} name
   * @param {FilePropertyBag} [options]
   */
  function SyncFile(parts, name, options) {
    var _this2;
    _classCallCheck(this, SyncFile);
    _this2 = _callSuper(this, SyncFile, [parts, name, options]);
    syncBytesMap.set(_this2, partsToBuffer(parts));
    return _this2;
  }
  _inherits(SyncFile, _File);
  return _createClass(SyncFile);
}(/*#__PURE__*/_wrapNativeSuper(File));

/* eslint-disable unicorn/no-this-outside-of-class -- Monkey-patching */
// @ts-nocheck -- jsdom has no types for the file we need
/* globals location, XMLHttpRequest -- Polyfills */

var require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)));
var _require = require$1('jsdom/lib/generated/idl/utils.js'),
  implForWrapper = _require.implForWrapper;
var serializeURLOrigin = whatwgURL.serializeURLOrigin,
  parseURL = whatwgURL.parseURL;

/**
 * @type {{[key: string]: Blob}}
 */
var blobURLs = {};

/**
 * @param {Blob} blob
 * @returns {string}
 */
var createObjectURL = function createObjectURL(blob) {
  var parsedURL = parseURL(location.href);
  // https://github.com/jsdom/jsdom/issues/1721#issuecomment-282465529
  var blobURL = 'blob:' + (parsedURL ? serializeURLOrigin(parsedURL)
  // While `parseURL` can return `null`, `location.href`
  //  tends not to allow
  /* c8 ignore next */ : 'null') + '/' + generateUUID();
  blobURLs[blobURL] = blob;
  return blobURL;
};

/**
 * @param {string} blobURL
 * @returns {void}
 */
var revokeObjectURL = function revokeObjectURL(blobURL) {
  delete blobURLs[blobURL];
};

/**
 * Synchronously reads the content of a `Blob`/`File` previously registered
 *   via `createObjectURL`. `SyncBlob`/`SyncFile` (see `SyncBlobFile.js`)
 *   keep their own synchronously-readable copy of the content for
 *   environments without jsdom (e.g. Node on its own); prefer that if
 *   present, falling back to jsdom's internal wrapper-unwrapping otherwise.
 * @param {Blob} blob
 * @returns {Buffer|undefined}
 */
var getBlobBytesSync = function getBlobBytesSync(blob) {
  var _implForWrapper;
  return getSyncBytes(blob) || ((_implForWrapper = implForWrapper(blob)) === null || _implForWrapper === void 0 ? void 0 : _implForWrapper._bytes);
};

/**
 * Resolves a `blob:` URL (previously registered via `createObjectURL`) back
 *   to its content, synchronously -- for use by any XHR/`fetch` polyfill
 *   that needs to serve `blob:` URLs itself (mirroring how browsers read
 *   `blob:` URLs without going over the network).
 * @param {string} blobURL
 * @returns {{type: string, bytes: Buffer}|undefined} `undefined` if
 *   `blobURL` is not (or is no longer) a registered `blob:` URL.
 */
var resolveObjectURL = function resolveObjectURL(blobURL) {
  var blob = blobURLs[blobURL];
  if (!blob) {
    return undefined;
  }
  // eslint-disable-next-line n/no-sync -- Deliberate
  var bytes = getBlobBytesSync(blob);
  if (!bytes) {
    return undefined;
  }
  return {
    type: blob.type,
    bytes: bytes
  };
};

// We only handle the case of binary, so no need to override `open`
//   in all cases; but this only works if override is called first

/**
 * @callback XMLHttpRequestMimeOverrider
 * @param {string} mimeType
 * @returns {void}
 */

/**
 * @param {object} [cfg]
 * @param {boolean} [cfg.polyfillDataURLs]
 * @returns {XMLHttpRequestMimeOverrider}
 */
var xmlHttpRequestOverrideMimeType = function xmlHttpRequestOverrideMimeType() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    polyfillDataURLs = _ref.polyfillDataURLs;
  // Set these references late in case global `XMLHttpRequest` has since
  //  been changed/set
  var _xhropen = XMLHttpRequest.prototype.open;
  var _xhrOverrideMimeType = XMLHttpRequest.prototype.overrideMimeType;
  return function (mimeType) {
    if (mimeType === 'text/plain; charset=x-user-defined') {
      /**
       * @param {string} method
       * @param {string} url
       * @param {boolean} async
       * @returns {void}
       */
      this.open = function (method, url, async) {
        if (url.startsWith('blob:')) {
          var blob = blobURLs[url];
          if (!blob) {
            this.send = function () {
              throw new DOMException("Failed to execute 'send' on " + "'XMLHttpRequest': Failed to " + "load '".concat(url, "'"), 'NetworkError');
            };
            return undefined;
          }
          var responseType = 'text/plain'; // blob.type;
          // utf16le and base64 both convert lone surrogates

          // eslint-disable-next-line n/no-sync -- Deliberate
          var syncBytes = getBlobBytesSync(blob);
          // jsdom changed Blob internals from `_buffer`
          // to `_bytes`; support both.
          var encoded = Buffer.from(syncBytes).toString('binary');

          // Not usable in jsdom which makes properties readonly,
          //   but local-xmlhttprequest can use (and jsdom can
          //   handle data URLs anyways)
          if (polyfillDataURLs) {
            this.status = 200;
            this.send = function () {
              // Empty
            };
            this.responseType = responseType;
            this.responseText = encoded;
            return undefined;
          }
          url = 'data:' + responseType + ',' + encodeURIComponent(encoded);
        }
        return _xhropen.call(this, method, url, async);
      };

      // As of jsdom 22.0.0, this is needed as the code below will
      //    have its own effects in overriding `responseText`
      return undefined;
    }
    // The presence of `XMLHttpRequest.prototype.overrideMimeType`
    //   is not really needed here, so making optional
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return _xhrOverrideMimeType && _xhrOverrideMimeType.call.apply(_xhrOverrideMimeType, [this, mimeType].concat(args));
  };
};

/* eslint-disable no-shadow -- Polyfill */
/**
 * QuotaExceededError polyfill (not yet available in Node/jsdom).
 */
var QuotaExceededError = /*#__PURE__*/function (_DOMException) {
  /* eslint-enable no-shadow -- Polyfill */
  /**
   * @param {string} [message]
   * @param {{quota?: number, requested?: number}} [options]
   */
  function QuotaExceededError() {
    var _this;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      quota = _ref.quota,
      requested = _ref.requested;
    _classCallCheck(this, QuotaExceededError);
    _this = _callSuper(this, QuotaExceededError, [message, 'QuotaExceededError']);
    _this._quota = quota === undefined ? null : quota;
    _this._requested = requested === undefined ? null : requested;
    if (_this._quota !== null && _this._quota < 0) {
      throw new RangeError('quota must not be negative');
    }
    if (_this._requested !== null && _this._requested < 0) {
      throw new RangeError('requested must not be negative');
    }
    if (_this._quota !== null && _this._requested !== null && _this._requested < _this._quota) {
      throw new RangeError('requested must not be less than quota');
    }
    return _this;
  }

  /**
   * @returns {number|null}
   */
  _inherits(QuotaExceededError, _DOMException);
  return _createClass(QuotaExceededError, [{
    key: "quota",
    get: function get() {
      return this._quota;
    }

    /**
     * @returns {number|null}
     */
  }, {
    key: "requested",
    get: function get() {
      return this._requested;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'QuotaExceededError';
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(DOMException));

/**
 * WebTransportError polyfill (not yet available in Node/jsdom).
 */
var WebTransportError = /*#__PURE__*/function (_DOMException) {
  /**
   * @param {{
   *   message?: string,
   *   source?: "stream"|"session",
   *   streamErrorCode?: number|null
   * }} [init]
   */
  function WebTransportError() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message,
      _ref$source = _ref.source,
      source = _ref$source === void 0 ? 'stream' : _ref$source,
      _ref$streamErrorCode = _ref.streamErrorCode,
      streamErrorCode = _ref$streamErrorCode === void 0 ? null : _ref$streamErrorCode;
    _classCallCheck(this, WebTransportError);
    _this = _callSuper(this, WebTransportError, [message, 'WebTransportError']);
    _this._source = source;
    _this._streamErrorCode = streamErrorCode;
    return _this;
  }

  /**
   * @returns {"stream"|"session"}
   */
  _inherits(WebTransportError, _DOMException);
  return _createClass(WebTransportError, [{
    key: "source",
    get: function get() {
      return this._source;
    }

    /**
     * @returns {number|null}
     */
  }, {
    key: "streamErrorCode",
    get: function get() {
      return this._streamErrorCode;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'WebTransportError';
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(DOMException));

// Map format names to byte sizes and TypedArray constructors
var FORMAT_MAP = {
  u8: {
    bytesPerSample: 1,
    TypedArray: Uint8Array,
    isPlanar: false
  },
  s16: {
    bytesPerSample: 2,
    TypedArray: Int16Array,
    isPlanar: false
  },
  s32: {
    bytesPerSample: 4,
    TypedArray: Int32Array,
    isPlanar: false
  },
  f32: {
    bytesPerSample: 4,
    TypedArray: Float32Array,
    isPlanar: false
  },
  'u8-planar': {
    bytesPerSample: 1,
    TypedArray: Uint8Array,
    isPlanar: true
  },
  's16-planar': {
    bytesPerSample: 2,
    TypedArray: Int16Array,
    isPlanar: true
  },
  's32-planar': {
    bytesPerSample: 4,
    TypedArray: Int32Array,
    isPlanar: true
  },
  'f32-planar': {
    bytesPerSample: 4,
    TypedArray: Float32Array,
    isPlanar: true
  }
};

/**
 * AudioData class.
 */
var AudioData = /*#__PURE__*/function () {
  /**
   * @typedef {"u8"|"s16"|"s32"|"f32"|"u8-planar"|"s16-planar"
   *   |"s32-planar"|"f32-planar"} AudioDataFormat
   */

  /**
   *
   * @param {{
   *   format: AudioDataFormat,
   *   sampleRate: number,
   *   numberOfChannels: number,
   *   numberOfFrames: number,
   *   timestamp: number,
   *   data: ArrayBufferView|ArrayBuffer
   * }} cfg
   */
  function AudioData(_ref) {
    var format = _ref.format,
      sampleRate = _ref.sampleRate,
      numberOfChannels = _ref.numberOfChannels,
      numberOfFrames = _ref.numberOfFrames,
      _ref$timestamp = _ref.timestamp,
      timestamp = _ref$timestamp === void 0 ? 0 : _ref$timestamp,
      data = _ref.data;
    _classCallCheck(this, AudioData);
    if (!Object.hasOwn(FORMAT_MAP, format)) {
      throw new TypeError("Unsupported audio format: ".concat(format));
    }
    this.format = format;
    this.sampleRate = sampleRate;
    this.numberOfChannels = numberOfChannels;
    this.numberOfFrames = numberOfFrames;
    this.timestamp = timestamp;
    // Per the WebCodecs spec, `duration` is an `unsigned long long`
    //   count of microseconds: `(numberOfFrames / sampleRate)`
    //   seconds times 1,000,000, truncated to an integer.
    this.duration = Math.trunc(numberOfFrames / sampleRate * 1000000);
    var meta = FORMAT_MAP[format];
    this._bytesPerSample = meta.bytesPerSample;
    this._TypedArray = meta.TypedArray;
    this._isPlanar = Boolean(meta.isPlanar);

    // Per the AudioData API, `data` is a single buffer; for planar
    //   formats, each channel's plane is stored back-to-back within it.
    this._data = ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
  }

  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(AudioData, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'AudioData';
    }

    /**
     *
     * @param {{
     *   planeIndex?: number,
     *   frameCount?: number
     * }} [options]
     * @returns {number}
     */
  }, {
    key: "allocationSize",
    value: function allocationSize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var planeIndex = options.planeIndex || 0;
      var frameCount = options.frameCount !== undefined ? options.frameCount : this.numberOfFrames;
      if (this._isPlanar) {
        if (planeIndex >= this.numberOfChannels) {
          throw new RangeError("planeIndex ".concat(planeIndex, " out of bounds for channel count ").concat(this.numberOfChannels));
        }
        // Planar: One independent buffer per channel
        return frameCount * this._bytesPerSample;
      }
      if (planeIndex !== 0) {
        throw new RangeError("Interleaved formats only have 1 plane (planeIndex 0)");
      }
      // Interleaved: Channels multiplexed in one buffer
      return frameCount * this.numberOfChannels * this._bytesPerSample;
    }

    /**
     *
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @param {{
     *   planeIndex?: number,
     *   frameOffset?: number,
     *   frameCount?: number
     * }} [options]
     * @returns {void}
     */
  }, {
    key: "copyTo",
    value: function copyTo(destination) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var planeIndex = options.planeIndex || 0;
      var frameOffset = options.frameOffset || 0;
      var frameCount = options.frameCount !== undefined ? options.frameCount : this.numberOfFrames - frameOffset;
      if (frameOffset + frameCount > this.numberOfFrames) {
        throw new RangeError('Requested frame offset or count exceeds ' + 'total available frames.');
      }

      // Explicitly target the ArrayBuffer underlying the incoming View
      //   (e.g. Node Buffer, Float32Array)
      var destIsView = ArrayBuffer.isView(destination);
      var targetBuffer = /** @type {ArrayBuffer} */
      destIsView ? destination.buffer : destination;
      var targetByteOffset = destIsView ? destination.byteOffset : 0;
      var targetByteLength = destination.byteLength;

      // Check size requirements matching standard layout sizes
      var requiredSize = this.allocationSize({
        planeIndex: planeIndex,
        frameCount: frameCount
      });
      if (targetByteLength < requiredSize) {
        throw new RangeError("Destination buffer is too small. Need ".concat(requiredSize, " bytes, got ").concat(targetByteLength, "."));
      }

      // Map a TypedArray overlay precisely onto the target buffer location
      var destElements = requiredSize / this._bytesPerSample;
      var destView = new this._TypedArray(targetBuffer, targetByteOffset, destElements);

      // Planar formats store each channel's plane back-to-back within
      //   `_data`; interleaved formats store one plane with samples
      //   multiplexed across channels.
      var chCount = this._isPlanar ? 1 : this.numberOfChannels;
      var planeByteOffset = this._isPlanar ? planeIndex * this.numberOfFrames * this._bytesPerSample : 0;
      var startElement = frameOffset * chCount;
      var elementCount = frameCount * chCount;
      var sourceByteOffset = planeByteOffset + startElement * this._bytesPerSample;
      var sourceView = new this._TypedArray(/** @type {ArrayBuffer} */this._data.buffer, this._data.byteOffset + sourceByteOffset, elementCount);
      destView.set(sourceView);
    }
  }]);
}();

/**
 * EncodedAudioChunk class.
 */
var EncodedAudioChunk = /*#__PURE__*/function () {
  /**
   * @typedef {"key"|"delta"} EncodedAudioChunkType
   */

  /**
   * @param {{
   *   type: EncodedAudioChunkType,
   *   timestamp: number,
   *   duration?: number,
   *   data: ArrayBufferView|ArrayBuffer
   * }} init
   */
  function EncodedAudioChunk(_ref) {
    var type = _ref.type,
      timestamp = _ref.timestamp,
      duration = _ref.duration,
      data = _ref.data;
    _classCallCheck(this, EncodedAudioChunk);
    if (type !== 'key' && type !== 'delta') {
      throw new TypeError("Unsupported EncodedAudioChunk type: ".concat(type));
    }
    this.type = type;
    this.timestamp = timestamp;
    this.duration = duration !== null && duration !== void 0 ? duration : null;
    this._data = ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
  }

  /**
   * @returns {number}
   */
  return _createClass(EncodedAudioChunk, [{
    key: "byteLength",
    get: function get() {
      return this._data.byteLength;
    }

    /**
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @returns {void}
     */
  }, {
    key: "copyTo",
    value: function copyTo(destination) {
      var destIsView = ArrayBuffer.isView(destination);
      var targetBuffer = /** @type {ArrayBuffer} */
      destIsView ? destination.buffer : destination;
      var targetByteOffset = destIsView ? destination.byteOffset : 0;
      var targetByteLength = destination.byteLength;
      if (targetByteLength < this._data.byteLength) {
        // Browsers throw a `TypeError` (not a `RangeError`) here.
        throw new TypeError("Destination buffer is too small. Need ".concat(this._data.byteLength, " bytes, got ").concat(targetByteLength, "."));
      }
      var destView = new Uint8Array(targetBuffer, targetByteOffset, this._data.byteLength);
      destView.set(this._data);
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'EncodedAudioChunk';
    }
  }]);
}();

/**
 * EncodedVideoChunk class.
 */
var EncodedVideoChunk = /*#__PURE__*/function () {
  /**
   * @typedef {"key"|"delta"} EncodedVideoChunkType
   */

  /**
   * @param {{
   *   type: EncodedVideoChunkType,
   *   timestamp: number,
   *   duration?: number,
   *   data: ArrayBufferView|ArrayBuffer
   * }} init
   */
  function EncodedVideoChunk(_ref) {
    var type = _ref.type,
      timestamp = _ref.timestamp,
      duration = _ref.duration,
      data = _ref.data;
    _classCallCheck(this, EncodedVideoChunk);
    if (type !== 'key' && type !== 'delta') {
      throw new TypeError("Unsupported EncodedVideoChunk type: ".concat(type));
    }
    this.type = type;
    this.timestamp = timestamp;
    this.duration = duration !== null && duration !== void 0 ? duration : null;
    this._data = ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
  }

  /**
   * @returns {number}
   */
  return _createClass(EncodedVideoChunk, [{
    key: "byteLength",
    get: function get() {
      return this._data.byteLength;
    }

    /**
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @returns {void}
     */
  }, {
    key: "copyTo",
    value: function copyTo(destination) {
      var destIsView = ArrayBuffer.isView(destination);
      var targetBuffer = /** @type {ArrayBuffer} */
      destIsView ? destination.buffer : destination;
      var targetByteOffset = destIsView ? destination.byteOffset : 0;
      var targetByteLength = destination.byteLength;
      if (targetByteLength < this._data.byteLength) {
        // Browsers throw a `TypeError` (not a `RangeError`) here.
        throw new TypeError("Destination buffer is too small. Need ".concat(this._data.byteLength, " bytes, got ").concat(targetByteLength, "."));
      }
      var destView = new Uint8Array(targetBuffer, targetByteOffset, this._data.byteLength);
      destView.set(this._data);
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'EncodedVideoChunk';
    }
  }]);
}();

// Per-plane subsampling factors (relative to `codedWidth`/`codedHeight`)
//   and bytes per sample, keyed by `VideoPixelFormat`. Planes are assumed
//   to be stored tightly packed and back-to-back within a single buffer,
//   in the order listed here.
var PIXEL_FORMATS = {
  I420: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // Y
  {
    xSub: 2,
    ySub: 2,
    bytesPerSample: 1
  },
  // U
  {
    xSub: 2,
    ySub: 2,
    bytesPerSample: 1
  } // V
  ],
  I420A: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // Y
  {
    xSub: 2,
    ySub: 2,
    bytesPerSample: 1
  },
  // U
  {
    xSub: 2,
    ySub: 2,
    bytesPerSample: 1
  },
  // V
  {
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  } // A
  ],
  I422: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // Y
  {
    xSub: 2,
    ySub: 1,
    bytesPerSample: 1
  },
  // U
  {
    xSub: 2,
    ySub: 1,
    bytesPerSample: 1
  } // V
  ],
  I444: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // Y
  {
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // U
  {
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  } // V
  ],
  NV12: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 1
  },
  // Y
  {
    xSub: 2,
    ySub: 2,
    bytesPerSample: 2
  } // Interleaved UV
  ],
  RGBA: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 4
  }],
  RGBX: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 4
  }],
  BGRA: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 4
  }],
  BGRX: [{
    xSub: 1,
    ySub: 1,
    bytesPerSample: 4
  }]
};

// `VideoPixelFormat`s that carry red/green/blue channels (an "RGB
//   format" per the WebCodecs spec). Used to pick the default
//   `colorSpace` when the caller does not supply one.
var RGB_FORMATS = new Set(['RGBA', 'RGBX', 'BGRA', 'BGRX']);

/**
 * VideoFrame class.
 *
 * Note: Unlike the spec, this polyfill only supports construction from
 *   a raw pixel buffer (`VideoFrameBufferInit`); constructing from a
 *   `CanvasImageSource` is not supported as there is no such source of
 *   pixels available by default in Node. `copyTo`/`allocationSize` also
 *   always treat the source data as tightly packed at `codedWidth` x
 *   `codedHeight` (i.e. a custom `layout` is not supported).
 */
var _data = /*#__PURE__*/new WeakMap();
var _closed = /*#__PURE__*/new WeakMap();
var _VideoFrame_brand = /*#__PURE__*/new WeakSet();
var VideoFrame = /*#__PURE__*/function () {
  /**
   * @param {ArrayBufferView|ArrayBuffer} data
   * @param {{
   *   format: VideoPixelFormat,
   *   codedWidth: number,
   *   codedHeight: number,
   *   timestamp: number,
   *   duration?: number|null,
   *   visibleRect?: VideoFrameRect,
   *   displayWidth?: number,
   *   displayHeight?: number,
   *   colorSpace?: {
   *     primaries: string|null,
   *     transfer: string|null,
   *     matrix: string|null,
   *     fullRange: boolean|null
   *   }
   * }} init
   */
  function VideoFrame(data, _ref) {
    var _format = _ref.format,
      codedWidth = _ref.codedWidth,
      codedHeight = _ref.codedHeight,
      timestamp = _ref.timestamp,
      duration = _ref.duration,
      visibleRect = _ref.visibleRect,
      displayWidth = _ref.displayWidth,
      displayHeight = _ref.displayHeight,
      colorSpace = _ref.colorSpace;
    _classCallCheck(this, VideoFrame);
    /**
     * @returns {void}
     */
    _classPrivateMethodInitSpec(this, _VideoFrame_brand);
    /**
     * @typedef {"BGRA"|"BGRX"|"I420"|"I420A"|"I422"|"I444"|"NV12"|"RGBA"
     *   |"RGBX"} VideoPixelFormat
     */

    /**
     * @typedef {{
     *   x: number, y: number, width: number, height: number
     * }} VideoFrameRect
     */

    /** @type {Uint8Array|undefined} */
    _classPrivateFieldInitSpec(this, _data, void 0);
    /** @type {boolean} */
    _classPrivateFieldInitSpec(this, _closed, void 0);
    /** @type {VideoPixelFormat|null} */
    _defineProperty(this, "format", void 0);
    /** @type {number} */
    _defineProperty(this, "codedWidth", void 0);
    /** @type {number} */
    _defineProperty(this, "codedHeight", void 0);
    /** @type {VideoFrameRect|null} */
    _defineProperty(this, "codedRect", void 0);
    /** @type {number} */
    _defineProperty(this, "timestamp", void 0);
    /** @type {number|null} */
    _defineProperty(this, "duration", void 0);
    /** @type {VideoFrameRect|null} */
    _defineProperty(this, "visibleRect", void 0);
    /** @type {number} */
    _defineProperty(this, "displayWidth", void 0);
    /** @type {number} */
    _defineProperty(this, "displayHeight", void 0);
    /**
     * @type {{
     *   primaries: string|null, transfer: string|null,
     *   matrix: string|null, fullRange: boolean|null
     * }}
     */
    _defineProperty(this, "colorSpace", void 0);
    if (!Object.hasOwn(PIXEL_FORMATS, _format)) {
      throw new TypeError("Unsupported video pixel format: ".concat(_format));
    }
    this.format = _format;
    this.codedWidth = codedWidth;
    this.codedHeight = codedHeight;
    this.codedRect = {
      x: 0,
      y: 0,
      width: codedWidth,
      height: codedHeight
    };
    this.timestamp = timestamp;
    this.duration = duration !== null && duration !== void 0 ? duration : null;
    this.visibleRect = visibleRect ? {
      x: visibleRect.x,
      y: visibleRect.y,
      width: visibleRect.width,
      height: visibleRect.height
    } : {
      x: 0,
      y: 0,
      width: codedWidth,
      height: codedHeight
    };
    this.displayWidth = displayWidth !== null && displayWidth !== void 0 ? displayWidth : this.visibleRect.width;
    this.displayHeight = displayHeight !== null && displayHeight !== void 0 ? displayHeight : this.visibleRect.height;

    // Per the spec's "Pick Color Space" algorithm: an explicit
    //   `colorSpace` is used as given; otherwise the frame defaults
    //   to the sRGB color space for RGB pixel formats and to REC709
    //   for all others.
    if (colorSpace) {
      this.colorSpace = {
        primaries: colorSpace.primaries,
        transfer: colorSpace.transfer,
        matrix: colorSpace.matrix,
        fullRange: colorSpace.fullRange
      };
    } else if (RGB_FORMATS.has(_format)) {
      this.colorSpace = {
        primaries: 'bt709',
        transfer: 'iec61966-2-1',
        matrix: 'rgb',
        fullRange: true
      };
    } else {
      this.colorSpace = {
        primaries: 'bt709',
        transfer: 'bt709',
        matrix: 'bt709',
        fullRange: false
      };
    }
    _classPrivateFieldSet2(_data, this, ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data));
    _classPrivateFieldSet2(_closed, this, false);
  }
  return _createClass(VideoFrame, [{
    key: "allocationSize",
    value:
    /**
     * @param {{
     *   rect?: {x: number, y: number, width: number, height: number},
     *   format?: VideoPixelFormat
     * }} [options]
     * @returns {number}
     */
    function allocationSize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _assertClassBrand(_VideoFrame_brand, this, _checkNotClosed).call(this);
      return _assertClassBrand(_VideoFrame_brand, this, _layout).call(this, options).totalSize;
    }

    /**
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @param {{
     *   rect?: {x: number, y: number, width: number, height: number},
     *   format?: VideoPixelFormat
     * }} [options]
     * @returns {Promise<{offset: number, stride: number}[]>}
     */
  }, {
    key: "copyTo",
    value: function copyTo(destination) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _assertClassBrand(_VideoFrame_brand, this, _checkNotClosed).call(this);
      var _assertClassBrand$cal = _assertClassBrand(_VideoFrame_brand, this, _layout).call(this, options),
        planes = _assertClassBrand$cal.planes,
        layout = _assertClassBrand$cal.layout,
        totalSize = _assertClassBrand$cal.totalSize;
      var data = /** @type {Uint8Array} */_classPrivateFieldGet2(_data, this);
      var destIsView = ArrayBuffer.isView(destination);
      var targetBuffer = /** @type {ArrayBuffer} */
      destIsView ? destination.buffer : destination;
      var targetByteOffset = destIsView ? destination.byteOffset : 0;
      var targetByteLength = destination.byteLength;
      if (targetByteLength < totalSize) {
        // Browsers reject with a `TypeError` (not a `RangeError`) here.
        throw new TypeError("Destination buffer is too small. Need ".concat(totalSize, " bytes, got ").concat(targetByteLength, "."));
      }
      var destBytes = new Uint8Array(targetBuffer, targetByteOffset, totalSize);
      var _iterator = _createForOfIteratorHelper(planes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var plane = _step.value;
          var srcPlaneOffset = plane.srcPlaneOffset,
            srcStride = plane.srcStride,
            srcRowStart = plane.srcRowStart,
            srcRowStartY = plane.srcRowStartY,
            planeWidth = plane.planeWidth,
            planeHeight = plane.planeHeight,
            bytesPerSample = plane.bytesPerSample,
            stride = plane.stride,
            offset = plane.offset;
          var rowBytes = planeWidth * bytesPerSample;
          for (var row = 0; row < planeHeight; row++) {
            var srcStart = srcPlaneOffset + (srcRowStartY + row) * srcStride + srcRowStart;
            destBytes.set(data.subarray(srcStart, srcStart + rowBytes), offset + row * stride);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return Promise.resolve(layout);
    }

    /**
     * @returns {VideoFrame}
     */
  }, {
    key: "clone",
    value: function clone() {
      _assertClassBrand(_VideoFrame_brand, this, _checkNotClosed).call(this);
      var data = /** @type {Uint8Array} */_classPrivateFieldGet2(_data, this);
      return new VideoFrame(data.slice(), {
        format: (/** @type {VideoPixelFormat} */this.format),
        codedWidth: this.codedWidth,
        codedHeight: this.codedHeight,
        timestamp: this.timestamp,
        duration: this.duration,
        visibleRect: (/** @type {VideoFrameRect} */this.visibleRect),
        displayWidth: this.displayWidth,
        displayHeight: this.displayHeight,
        colorSpace: this.colorSpace
      });
    }

    /**
     * @returns {void}
     */
  }, {
    key: "close",
    value: function close() {
      _classPrivateFieldSet2(_closed, this, true);
      _classPrivateFieldSet2(_data, this, undefined);
      this.format = null;
      this.codedWidth = 0;
      this.codedHeight = 0;
      this.codedRect = null;
      this.visibleRect = null;
      this.displayWidth = 0;
      this.displayHeight = 0;
      this.duration = null;
      this.timestamp = 0;
      this.colorSpace = {
        primaries: null,
        transfer: null,
        matrix: null,
        fullRange: null
      };
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'VideoFrame';
    }
  }]);
}();
function _checkNotClosed() {
  if (_classPrivateFieldGet2(_closed, this)) {
    throw new DOMException('VideoFrame is closed', 'InvalidStateError');
  }
}
/**
 * Computes, for the (cropped) region of interest, the byte layout of
 *   each plane both within our tightly packed source data and within
 *   a tightly packed destination buffer.
 * @param {{
 *   rect?: {x: number, y: number, width: number, height: number},
 *   format?: VideoPixelFormat
 * }} options
 * @returns {{
 *   planes: {
 *     srcPlaneOffset: number, srcStride: number,
 *     srcRowStart: number, srcRowStartY: number,
 *     planeWidth: number, planeHeight: number, bytesPerSample: number,
 *     stride: number, offset: number
 *   }[],
 *   layout: {offset: number, stride: number}[],
 *   totalSize: number
 * }}
 */
function _layout(options) {
  var _this = this;
  if (options.format && options.format !== this.format) {
    // Browsers reject an unsupported pixel-format conversion with
    //   a `NotSupportedError` `DOMException`.
    throw new DOMException('VideoFrame polyfill does not support pixel format conversion', 'NotSupportedError');
  }

  // Only reached while open (callers always call `#checkNotClosed`
  //   first), so `format`/`visibleRect` are known non-null here.
  var rawFormat = this.format,
    rawVisibleRect = this.visibleRect;
  var format = /** @type {VideoPixelFormat} */rawFormat;
  var rect = options.rect || (/** @type {VideoFrameRect} */rawVisibleRect);
  var specs = PIXEL_FORMATS[format];
  var srcOffset = 0;
  var srcPlaneOffsets = specs.map(function (_ref2) {
    var xSub = _ref2.xSub,
      ySub = _ref2.ySub,
      bytesPerSample = _ref2.bytesPerSample;
    var planeOffset = srcOffset;
    srcOffset += Math.ceil(_this.codedWidth / xSub) * Math.ceil(_this.codedHeight / ySub) * bytesPerSample;
    return planeOffset;
  });
  var destOffset = 0;
  var planes = specs.map(function (_ref3, i) {
    var xSub = _ref3.xSub,
      ySub = _ref3.ySub,
      bytesPerSample = _ref3.bytesPerSample;
    var planeWidth = Math.ceil(rect.width / xSub);
    var planeHeight = Math.ceil(rect.height / ySub);
    var stride = planeWidth * bytesPerSample;
    var offset = destOffset;
    destOffset += stride * planeHeight;
    return {
      srcPlaneOffset: srcPlaneOffsets[i],
      srcStride: Math.ceil(_this.codedWidth / xSub) * bytesPerSample,
      srcRowStart: Math.floor(rect.x / xSub) * bytesPerSample,
      srcRowStartY: Math.floor(rect.y / ySub),
      planeWidth: planeWidth,
      planeHeight: planeHeight,
      bytesPerSample: bytesPerSample,
      stride: stride,
      offset: offset
    };
  });
  return {
    planes: planes,
    layout: planes.map(function (_ref4) {
      var offset = _ref4.offset,
        stride = _ref4.stride;
      return {
        offset: offset,
        stride: stride
      };
    }),
    totalSize: destOffset
  };
}

// No constructor in JSDom
// globalThis.DOMRect = window.DOMRect;
/**
 * DOMRect class.
 */
var DOMRect = /*#__PURE__*/function () {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  function DOMRect(x, y, width, height) {
    _classCallCheck(this, DOMRect);
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
    this.bottom = y + height;
    this.right = x + width;
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMRect, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMRect';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMRectReadOnly = window.DOMRectReadOnly;
/**
 * DOMRectReadOnly class.
 */
var DOMRectReadOnly = /*#__PURE__*/function () {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  function DOMRectReadOnly(x, y, width, height) {
    _classCallCheck(this, DOMRectReadOnly);
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
    this.bottom = y + height;
    this.right = x + width;
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMRectReadOnly, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMRectReadOnly';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMPoint = window.DOMPoint;
/**
 * DOMPoint class.
 */
var DOMPoint = /*#__PURE__*/function () {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  function DOMPoint(x, y, z, w) {
    _classCallCheck(this, DOMPoint);
    this.x = x !== null && x !== void 0 ? x : 0;
    this.y = y !== null && y !== void 0 ? y : 0;
    this.z = z !== null && z !== void 0 ? z : 0;
    this.w = w !== null && w !== void 0 ? w : 1;
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMPoint, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMPoint';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMPointReadOnly = window.DOMPointReadOnly;
/**
 * DOMPointReadOnly class.
 */
var DOMPointReadOnly = /*#__PURE__*/function () {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  function DOMPointReadOnly(x, y, z, w) {
    _classCallCheck(this, DOMPointReadOnly);
    this.x = x !== null && x !== void 0 ? x : 0;
    this.y = y !== null && y !== void 0 ? y : 0;
    this.z = z !== null && z !== void 0 ? z : 0;
    this.w = w !== null && w !== void 0 ? w : 1;
  }

  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMPointReadOnly, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMPointReadOnly';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMQuad = window.DOMQuad;
/**
 * DOMQuad class.
 */
var DOMQuad = /*#__PURE__*/function () {
  /**
   * @param {DOMPoint} p1
   * @param {DOMPoint} p2
   * @param {DOMPoint} p3
   * @param {DOMPoint} p4
   */
  function DOMQuad(p1, p2, p3, p4) {
    _classCallCheck(this, DOMQuad);
    this.p1 = p1 !== null && p1 !== void 0 ? p1 : new DOMPoint(0, 0, 0, 1);
    this.p2 = p2 !== null && p2 !== void 0 ? p2 : new DOMPoint(0, 0, 0, 1);
    this.p3 = p3 !== null && p3 !== void 0 ? p3 : new DOMPoint(0, 0, 0, 1);
    this.p4 = p4 !== null && p4 !== void 0 ? p4 : new DOMPoint(0, 0, 0, 1);
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMQuad, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMQuad';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMMatrix = window.DOMMatrix;
/**
 * DOMMatrix class.
 */
var DOMMatrix = /*#__PURE__*/function () {
  /**
   * @param {[number, number, number, number, number, number]|
   *   [
   *     number, number, number, number,
   *     number, number, number, number,
   *     number, number, number, number,
   *     number, number, number, number
   * ]} [init] Per spec, omitting this initializes the 2D identity matrix.
   */
  function DOMMatrix() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 0, 0, 1, 0, 0];
    _classCallCheck(this, DOMMatrix);
    if (typeof init[6] !== 'number') {
      this.is2D = true;
      this.a = init[0];
      this.b = init[1];
      this.c = init[2];
      this.d = init[3];
      this.e = init[4];
      this.f = init[5];
      return;
    }
    this.is2D = false;
    this.m11 = init[0];
    this.m12 = init[1];
    this.m13 = init[2];
    this.m14 = init[3];
    this.m21 = init[4];
    this.m22 = init[5];
    this.m23 = init[6];
    this.m24 = init[7];
    this.m31 = init[8];
    this.m32 = init[9];
    this.m33 = init[10];
    this.m34 = init[11];
    this.m41 = init[12];
    this.m42 = init[13];
    this.m43 = init[14];
    this.m44 = init[15];
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMMatrix, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMMatrix';
    }
  }]);
}();

// No constructor in JSDom
// globalThis.DOMMatrixReadOnly = window.DOMMatrixReadOnly;
/**
 * DOMMatrixReadOnly class.
 */
var DOMMatrixReadOnly = /*#__PURE__*/function () {
  /**
   * @param {[number, number, number, number, number, number]|
   *   [
   *     number, number, number, number,
   *     number, number, number, number,
   *     number, number, number, number,
   *     number, number, number, number
   * ]} [init] Per spec, omitting this initializes the 2D identity matrix.
   */
  function DOMMatrixReadOnly() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 0, 0, 1, 0, 0];
    _classCallCheck(this, DOMMatrixReadOnly);
    if (typeof init[6] !== 'number') {
      this.is2D = true;
      this.a = init[0];
      this.b = init[1];
      this.c = init[2];
      this.d = init[3];
      this.e = init[4];
      this.f = init[5];
      return;
    }
    this.is2D = false;
    this.m11 = init[0];
    this.m12 = init[1];
    this.m13 = init[2];
    this.m14 = init[3];
    this.m21 = init[4];
    this.m22 = init[5];
    this.m23 = init[6];
    this.m24 = init[7];
    this.m31 = init[8];
    this.m32 = init[9];
    this.m33 = init[10];
    this.m34 = init[11];
    this.m41 = init[12];
    this.m42 = init[13];
    this.m43 = init[14];
    this.m44 = init[15];
  }
  /* eslint-disable class-methods-use-this -- Not needed */
  /**
   * @returns {string}
   */
  return _createClass(DOMMatrixReadOnly, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'DOMMatrixReadOnly';
    }
  }]);
}();

/**
 * @param {HTMLCanvasElement} cvs
 * @returns {Promise<HTMLCanvasElement>}
 */
/**
 * @param {ImageBitmapSource & {dataset?: {toStringTag?: string}}} cvs
 * @returns {Promise<ImageBitmap>}
 */
function createImageBitmap(_x) {
  return _createImageBitmap.apply(this, arguments);
}
function _createImageBitmap() {
  _createImageBitmap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(cvs) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          // This really ought not be a canvas, but it works as a simple shim
          //   for our tests
          // cvs[Symbol.toStringTag] = 'ImageBitmap';
          // Above line throwing in current jsdom now
          if (!cvs.dataset) {
            cvs.dataset = {};
          }
          cvs.dataset.toStringTag = 'ImageBitmap';
          _context.n = 1;
          return /** @type {ImageBitmap} */cvs;
        case 1:
          return _context.a(2, _context.v);
      }
    }, _callee);
  }));
  return _createImageBitmap.apply(this, arguments);
}

/**
 * For a full polyfill, use the likes of `indexeddbshim`
 */
var IDBKeyRange = /*#__PURE__*/function () {
  /**
   * Not the actual signature.
   * @param {IDBValidKey} lower
   * @param {IDBValidKey} upper
   * @param {boolean} lowerOpen
   * @param {boolean} upperOpen
   */
  function IDBKeyRange(lower, upper, lowerOpen, upperOpen) {
    _classCallCheck(this, IDBKeyRange);
    this.lower = lower;
    this.upper = upper;
    this.lowerOpen = lowerOpen;
    this.upperOpen = upperOpen;
  }

  /**
   * @returns {"IDBKeyRange"}
   */
  return _createClass(IDBKeyRange, [{
    key: Symbol.toStringTag,
    get: function get() {
      /* eslint-enable class-methods-use-this -- Not needed */
      return 'IDBKeyRange';
    }
  }], [{
    key: "bound",
    value: /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @param {IDBValidKey} lower
     * @param {IDBValidKey} upper
     * @param {boolean} lowerOpen
     * @param {boolean} upperOpen
     * @returns {IDBKeyRange}
     */
    function bound(lower, upper, lowerOpen, upperOpen) {
      return new IDBKeyRange(lower, upper, lowerOpen, upperOpen);
    }
  }]);
}();

exports.AudioData = AudioData;
exports.DOMMatrix = DOMMatrix;
exports.DOMMatrixReadOnly = DOMMatrixReadOnly;
exports.DOMPoint = DOMPoint;
exports.DOMPointReadOnly = DOMPointReadOnly;
exports.DOMQuad = DOMQuad;
exports.DOMRect = DOMRect;
exports.DOMRectReadOnly = DOMRectReadOnly;
exports.EncodedAudioChunk = EncodedAudioChunk;
exports.EncodedVideoChunk = EncodedVideoChunk;
exports.IDBKeyRange = IDBKeyRange;
exports.QuotaExceededError = QuotaExceededError;
exports.SyncBlob = SyncBlob;
exports.SyncFile = SyncFile;
exports.VideoFrame = VideoFrame;
exports.WebTransportError = WebTransportError;
exports.createImageBitmap = createImageBitmap;
exports.createObjectURL = createObjectURL;
exports.getBlobBytesSync = getBlobBytesSync;
exports.getSyncBytes = getSyncBytes;
exports.resolveObjectURL = resolveObjectURL;
exports.revokeObjectURL = revokeObjectURL;
exports.xmlHttpRequestOverrideMimeType = xmlHttpRequestOverrideMimeType;
//# sourceMappingURL=index.cjs.map
