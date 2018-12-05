(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * We keep this function minimized so if using two instances of this
   *   library, where one is minimized and one is not, it will still work
   *   with `hasConstructorOf`.
   * With ES6 classes, we may be able to simply use `class TypesonPromise
   *   extends Promise` and add a string tag for detection
   * @param {function} f
   */
  var TypesonPromise = function TypesonPromise(f) {
    _classCallCheck(this, TypesonPromise);

    this.p = new Promise(f);
  }; // eslint-disable-line block-spacing, space-before-function-paren, space-before-blocks, space-infix-ops, semi
  // class TypesonPromise extends Promise {get[Symbol.toStringTag](){return 'TypesonPromise'};} // eslint-disable-line keyword-spacing, space-before-function-paren, space-before-blocks, block-spacing, semi
  // Note: @babel/polyfill provides a `Symbol` polyfill


  if (typeof Symbol !== 'undefined') {
    // Ensure `isUserObject` will return `false` for `TypesonPromise`
    TypesonPromise.prototype[Symbol.toStringTag] = 'TypesonPromise';
  }
  /**
   *
   * @param {function} [onFulfilled]
   * @param {function} [onRejected]
   * @returns {TypesonPromise}
   */


  TypesonPromise.prototype.then = function (onFulfilled, onRejected) {
    var _this = this;

    return new TypesonPromise(function (typesonResolve, typesonReject) {
      _this.p.then(function (res) {
        typesonResolve(onFulfilled ? onFulfilled(res) : res);
      }, function (r) {
        _this.p['catch'](function (res) {
          return onRejected ? onRejected(res) : Promise.reject(res);
        }).then(typesonResolve, typesonReject);
      });
    });
  };
  /**
   *
   * @param {function} onRejected
   * @returns {TypesonPromise}
   */


  TypesonPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };
  /**
   *
   * @param {} v
   * @returns {TypesonPromise}
   */


  TypesonPromise.resolve = function (v) {
    return new TypesonPromise(function (typesonResolve) {
      typesonResolve(v);
    });
  };
  /**
   *
   * @param {} v
   * @returns {TypesonPromise}
   */


  TypesonPromise.reject = function (v) {
    return new TypesonPromise(function (typesonResolve, typesonReject) {
      typesonReject(v);
    });
  };

  ['all', 'race'].map(function (meth) {
    /**
     *
     * @param {Promise[]} promArr
     * @returns {TypesonPromise}
     */
    TypesonPromise[meth] = function (promArr) {
      return new TypesonPromise(function (typesonResolve, typesonReject) {
        Promise[meth](promArr.map(function (prom) {
          return prom.p;
        })).then(typesonResolve, typesonReject);
      });
    };
  });

  var _ref = {},
      toString = _ref.toString,
      hasOwn = {}.hasOwnProperty,
      getProto = Object.getPrototypeOf,
      fnToString = hasOwn.toString;
  /**
   *
   * @param {*} v
   * @param {boolean} catchCheck
   * @returns {boolean}
   */

  function isThenable(v, catchCheck) {
    return isObject(v) && typeof v.then === 'function' && (!catchCheck || typeof v.catch === 'function');
  }
  /**
   *
   * @param {*} val
   * @returns {string}
   */


  function toStringTag(val) {
    return toString.call(val).slice(8, -1);
  }
  /**
   * This function is dependent on both constructors
   *   being identical so any minimization is expected of both.
   * @param {*} a
   * @param {function} b
   * @returns {boolean}
   */


  function hasConstructorOf(a, b) {
    if (!a || _typeof(a) !== 'object') {
      return false;
    }

    var proto = getProto(a);

    if (!proto) {
      return false;
    }

    var Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;

    if (typeof Ctor !== 'function') {
      return b === null;
    }

    return typeof Ctor === 'function' && b !== null && fnToString.call(Ctor) === fnToString.call(b);
  }
  /**
   *
   * @param {*} val
   * @returns {boolean}
   */


  function isPlainObject(val) {
    // Mirrors jQuery's
    if (!val || toStringTag(val) !== 'Object') {
      return false;
    }

    var proto = getProto(val);

    if (!proto) {
      // `Object.create(null)`
      return true;
    }

    return hasConstructorOf(val, Object);
  }
  /**
   *
   * @param {*} val
   * @returns {boolean}
   */


  function isUserObject(val) {
    if (!val || toStringTag(val) !== 'Object') {
      return false;
    }

    var proto = getProto(val);

    if (!proto) {
      // `Object.create(null)`
      return true;
    }

    return hasConstructorOf(val, Object) || isUserObject(proto);
  }
  /**
   *
   * @param {*} v
   * @returns {boolean}
   */


  function isObject(v) {
    return v && _typeof(v) === 'object';
  }
  /**
   *
   * @param {string} keyPathComponent
   * @returns {string}
   */


  function escapeKeyPathComponent(keyPathComponent) {
    return keyPathComponent.replace(/~/g, '~0').replace(/\./g, '~1');
  }
  /**
   *
   * @param {string} keyPathComponent
   * @returns {string}
   */


  function unescapeKeyPathComponent(keyPathComponent) {
    return keyPathComponent.replace(/~1/g, '.').replace(/~0/g, '~');
  }
  /**
   * @param {object|array} obj
   * @param {string} keyPath
   * @returns {*}
   */


  function getByKeyPath(obj, keyPath) {
    if (keyPath === '') {
      return obj;
    }

    var period = keyPath.indexOf('.');

    if (period > -1) {
      var innerObj = obj[unescapeKeyPathComponent(keyPath.substr(0, period))];
      return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }

    return obj[unescapeKeyPathComponent(keyPath)];
  }

  function setAtKeyPath(obj, keyPath, value) {
    if (keyPath === '') {
      return value;
    }

    var period = keyPath.indexOf('.');

    if (period > -1) {
      var innerObj = obj[unescapeKeyPathComponent(keyPath.substr(0, period))];
      return setAtKeyPath(innerObj, keyPath.substr(period + 1), value);
    }

    obj[unescapeKeyPathComponent(keyPath)] = value;
    return obj;
  }
  /**
   *
   * @param {external:JSON} value
   * @returns {"null"|"array"|"undefined"|"boolean"|"number"|"string"|"object"|"symbol"}
   */


  function getJSONType(value) {
    return value === null ? 'null' : Array.isArray(value) ? 'array' : _typeof(value);
  }

  var keys = Object.keys,
      isArray = Array.isArray,
      hasOwn$1 = {}.hasOwnProperty,
      internalStateObjPropsToIgnore = ['type', 'replaced', 'iterateIn', 'iterateUnsetNumeric'];

  function nestedPathsFirst(a, b) {
    var as = a.keypath.match(/\./g);
    var bs = a.keypath.match(/\./g);

    if (as) {
      as = as.length;
    }

    if (bs) {
      bs = bs.length;
    }

    return as > bs ? -1 : bs < as ? 1 : a.keypath < b.keypath ? -1 : a.keypath > b.keypath;
  }
  /**
   * An instance of this class can be used to call `stringify()` and `parse()`.
   * Typeson resolves cyclic references by default. Can also be extended to
   * support custom types using the register() method.
   *
   * @constructor
   * @param {{cyclic: boolean}} [options] - if cyclic (default true),
   *   cyclic references will be handled gracefully.
   */


  var Typeson =
  /*#__PURE__*/
  function () {
    function Typeson(options) {
      _classCallCheck(this, Typeson);

      this.options = options; // Replacers signature: replace (value). Returns falsy if not
      //   replacing. Otherwise ['Date', value.getTime()]

      this.plainObjectReplacers = [];
      this.nonplainObjectReplacers = []; // Revivers: [{type => reviver}, {plain: boolean}].
      //   Sample: [{'Date': value => new Date(value)}, {plain: false}]

      this.revivers = {};
      /** Types registered via register() */

      this.types = {};
    }
    /**
     * Serialize given object to Typeson.
     * Initial arguments work identical to those of `JSON.stringify`.
     * The `replacer` argument has nothing to do with our replacers.
     * @param {*} obj
     * @param {function|string[]} replacer
     * @param {number|string} space
     * @param {object} opts
     * @returns {string|Promise} Promise resolves to a string
     */


    _createClass(Typeson, [{
      key: "stringify",
      value: function stringify(obj, replacer, space, opts) {
        opts = _objectSpread({}, this.options, opts, {
          stringification: true
        });
        var encapsulated = this.encapsulate(obj, null, opts);

        if (isArray(encapsulated)) {
          return JSON.stringify(encapsulated[0], replacer, space);
        }

        return encapsulated.then(function (res) {
          return JSON.stringify(res, replacer, space);
        });
      }
      /**
       * Also sync but throws on non-sync result
       * @param {*} obj
       * @param {function|string[]} replacer
       * @param {number|string} space
       * @param {object} opts
       * @returns {string}
       */

    }, {
      key: "stringifySync",
      value: function stringifySync(obj, replacer, space, opts) {
        return this.stringify(obj, replacer, space, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: true
        }));
      }
      /**
       *
       * @param {*} obj
       * @param {function|string[]} replacer
       * @param {number|string} space
       * @param {object} opts
       * @returns {Promise} Resolves to string
       */

    }, {
      key: "stringifyAsync",
      value: function stringifyAsync(obj, replacer, space, opts) {
        return this.stringify(obj, replacer, space, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: false
        }));
      }
      /**
       * Parse Typeson back into an obejct.
       * Initial arguments works identical to those of `JSON.parse()`.
       * @param {string} text
       * @param {function} reviver This JSON reviver has nothing to do with
       *   our revivers.
       * @param {object} opts
       * @returns {external:JSON}
       */

    }, {
      key: "parse",
      value: function parse(text, reviver, opts) {
        opts = _objectSpread({}, this.options, opts, {
          parse: true
        });
        return this.revive(JSON.parse(text, reviver), opts);
      }
      /**
      * Also sync but throws on non-sync result
      * @param {string} text
      * @param {function} reviver This JSON reviver has nothing to do with
      *   our revivers.
      * @param {object} opts
      * @returns {external:JSON}
      */

    }, {
      key: "parseSync",
      value: function parseSync(text, reviver, opts) {
        return this.parse(text, reviver, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: true
        }));
      }
      /**
      * @param {string} text
      * @param {function} reviver This JSON reviver has nothing to do with
      *   our revivers.
      * @param {object} opts
      * @returns {Promise} Resolves to `external:JSON`
      */

    }, {
      key: "parseAsync",
      value: function parseAsync(text, reviver, opts) {
        return this.parse(text, reviver, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: false
        }));
      }
      /**
       *
       * @param {*} obj
       * @param {object} stateObj
       * @param {object} [opts={}]
       * @returns {string[]|false}
       */

    }, {
      key: "specialTypeNames",
      value: function specialTypeNames(obj, stateObj) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        opts.returnTypeNames = true;
        return this.encapsulate(obj, stateObj, opts);
      }
      /**
       *
       * @param {*} obj
       * @param {object} stateObj
       * @param {object} [opts={}]
       * @returns {Promise|Array|object|string|false}
       */

    }, {
      key: "rootTypeName",
      value: function rootTypeName(obj, stateObj) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        opts.iterateNone = true;
        return this.encapsulate(obj, stateObj, opts);
      }
      /**
       * Encapsulate a complex object into a plain Object by replacing
       * registered types with plain objects representing the types data.
       *
       * This method is used internally by T`ypeson.stringify()`.
       * @param {Object} obj - Object to encapsulate.
       * @param {object} stateObj
       * @param {object} opts
       * @returns {Promise|Array|object|string|false}
       */

    }, {
      key: "encapsulate",
      value: function encapsulate(obj, stateObj, opts) {
        opts = _objectSpread({
          sync: true
        }, this.options, opts);
        var _opts = opts,
            sync = _opts.sync;
        var that = this,
            types = {},
            refObjs = [],
            // For checking cyclic references
        refKeys = [],
            // For checking cyclic references
        promisesDataRoot = []; // Clone the object deeply while at the same time replacing any
        //   special types or cyclic reference:

        var cyclic = opts && 'cyclic' in opts ? opts.cyclic : true;
        var _opts2 = opts,
            encapsulateObserver = _opts2.encapsulateObserver;

        var ret = _encapsulate('', obj, cyclic, stateObj || {}, promisesDataRoot);
        /**
         *
         * @param {*} ret
         * @returns {Array|object|string|false}
         */


        function finish(ret) {
          // Add `$types` to result only if we ever bumped into a
          //  special type (or special case where object has own `$types`)
          var typeNames = Object.values(types);

          if (opts.iterateNone) {
            if (typeNames.length) {
              return typeNames[0];
            }

            return Typeson.getJSONType(ret);
          }

          if (typeNames.length) {
            if (opts.returnTypeNames) {
              return _toConsumableArray(new Set(typeNames));
            } // Special if array (or a primitive) was serialized
            //   because JSON would ignore custom `$types` prop on it


            if (!ret || !isPlainObject(ret) || // Also need to handle if this is an object with its
            //   own `$types` property (to avoid ambiguity)
            hasOwn$1.call(ret, '$types')) {
              ret = {
                $: ret,
                $types: {
                  $: types
                }
              };
            } else {
              ret.$types = types;
            } // No special types

          } else if (isObject(ret) && hasOwn$1.call(ret, '$types')) {
            ret = {
              $: ret,
              $types: true
            };
          }

          if (opts.returnTypeNames) {
            return false;
          }

          return ret;
        }
        /**
         *
         * @param {*} ret
         * @param {array} promisesData
         * @returns {Promise} Resolves to ...
         */


        function checkPromises(_x, _x2) {
          return _checkPromises.apply(this, arguments);
        }
        /**
         *
         * @param {object} stateObj
         * @param {object} ownKeysObj
         * @param {function} cb
         * @returns {undefined}
         */


        function _checkPromises() {
          _checkPromises = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(ret, promisesData) {
            var promResults;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return Promise.all(promisesData.map(function (pd) {
                      return pd[1].p;
                    }));

                  case 2:
                    promResults = _context2.sent;
                    _context2.next = 5;
                    return Promise.all(promResults.map(
                    /*#__PURE__*/
                    function () {
                      var _ref = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee(promResult) {
                        var newPromisesData, _promisesData$splice, _promisesData$splice2, prData, _prData, keyPath, cyclic, stateObj, parentObj, key, detectedType, encaps, isTypesonPromise, encaps2;

                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                newPromisesData = [];
                                _promisesData$splice = promisesData.splice(0, 1), _promisesData$splice2 = _slicedToArray(_promisesData$splice, 1), prData = _promisesData$splice2[0];
                                _prData = _slicedToArray(prData, 7), keyPath = _prData[0], cyclic = _prData[2], stateObj = _prData[3], parentObj = _prData[4], key = _prData[5], detectedType = _prData[6];
                                encaps = _encapsulate(keyPath, promResult, cyclic, stateObj, newPromisesData, true, detectedType);
                                isTypesonPromise = hasConstructorOf(encaps, TypesonPromise); // Handle case where an embedded custom type itself
                                //   returns a `Typeson.Promise`

                                if (!(keyPath && isTypesonPromise)) {
                                  _context.next = 11;
                                  break;
                                }

                                _context.next = 8;
                                return encaps.p;

                              case 8:
                                encaps2 = _context.sent;
                                parentObj[key] = encaps2;
                                return _context.abrupt("return", checkPromises(ret, newPromisesData));

                              case 11:
                                if (keyPath) {
                                  parentObj[key] = encaps;
                                } else if (isTypesonPromise) {
                                  ret = encaps.p;
                                } else {
                                  // If this is itself a `Typeson.Promise` (because the
                                  //   original value supplied was a `Promise` or
                                  //   because the supplied custom type value resolved
                                  //   to one), returning it below will be fine since
                                  //   a `Promise` is expected anyways given current
                                  //   config (and if not a `Promise`, it will be ready
                                  //   as the resolve value)
                                  ret = encaps;
                                }

                                return _context.abrupt("return", checkPromises(ret, newPromisesData));

                              case 13:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee, this);
                      }));

                      return function (_x3) {
                        return _ref.apply(this, arguments);
                      };
                    }()));

                  case 5:
                    return _context2.abrupt("return", ret);

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
          return _checkPromises.apply(this, arguments);
        }

        function _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, cb) {
          Object.assign(stateObj, ownKeysObj);
          var vals = internalStateObjPropsToIgnore.map(function (prop) {
            var tmp = stateObj[prop];
            delete stateObj[prop];
            return tmp;
          });
          cb();
          internalStateObjPropsToIgnore.forEach(function (prop, i) {
            stateObj[prop] = vals[i];
          });
        }
        /**
         *
         * @param {string} keypath
         * @param {*} value
         * @param {boolean} cyclic
         * @param {object} stateObj
         * @param {boolean} promisesData
         * @param {boolean} resolvingTypesonPromise
         * @param {string} detectedType
         * @returns {*}
         */


        function _encapsulate(keypath, value, cyclic, stateObj, promisesData, resolvingTypesonPromise, detectedType) {
          var ret;
          var observerData = {};

          var $typeof = _typeof(value);

          var runObserver = encapsulateObserver ? function (obj) {
            var type = detectedType || stateObj.type || Typeson.getJSONType(value);
            encapsulateObserver(Object.assign(obj || observerData, {
              keypath: keypath,
              value: value,
              cyclic: cyclic,
              stateObj: stateObj,
              promisesData: promisesData,
              resolvingTypesonPromise: resolvingTypesonPromise,
              awaitingTypesonPromise: hasConstructorOf(value, TypesonPromise)
            }, type !== undefined ? {
              type: type
            } : {}));
          } : null;

          if (['string', 'boolean', 'number', 'undefined'].includes($typeof)) {
            if (value === undefined || $typeof === 'number' && (isNaN(value) || value === -Infinity || value === Infinity)) {
              ret = replace(keypath, value, stateObj, promisesData, false, resolvingTypesonPromise, runObserver);

              if (ret !== value) {
                observerData = {
                  replaced: ret
                };
              }
            } else {
              ret = value;
            }

            if (runObserver) {
              runObserver();
            }

            return ret;
          }

          if (value === null) {
            if (runObserver) {
              runObserver();
            }

            return value;
          }

          if (cyclic && !stateObj.iterateIn && !stateObj.iterateUnsetNumeric) {
            // Options set to detect cyclic references and be able
            //   to rewrite them.
            var refIndex = refObjs.indexOf(value);

            if (refIndex < 0) {
              if (cyclic === true) {
                refObjs.push(value);
                refKeys.push(keypath);
              }
            } else {
              types[keypath] = '#';

              if (runObserver) {
                runObserver({
                  cyclicKeypath: refKeys[refIndex]
                });
              }

              return '#' + refKeys[refIndex];
            }
          }

          var isPlainObj = isPlainObject(value);
          var isArr = isArray(value);
          var replaced = // Running replace will cause infinite loop as will test
          //   positive again
          (isPlainObj || isArr) && (!that.plainObjectReplacers.length || stateObj.replaced) || stateObj.iterateIn ? // Optimization: if plain object and no plain-object
          //   replacers, don't try finding a replacer
          value : replace(keypath, value, stateObj, promisesData, isPlainObj || isArr, null, runObserver);
          var clone;

          if (replaced !== value) {
            ret = replaced;
            observerData = {
              replaced: replaced
            };
          } else {
            if (isArr && stateObj.iterateIn !== 'object' || stateObj.iterateIn === 'array') {
              clone = new Array(value.length);
              observerData = {
                clone: clone
              };
            } else if (isPlainObj || stateObj.iterateIn === 'object') {
              clone = {};

              if (stateObj.addLength) {
                clone.length = value.length;
              }

              observerData = {
                clone: clone
              };
            } else if (keypath === '' && hasConstructorOf(value, TypesonPromise)) {
              promisesData.push([keypath, value, cyclic, stateObj, undefined, undefined, stateObj.type]);
              ret = value;
            } else {
              ret = value; // Only clone vanilla objects and arrays
            }
          }

          if (runObserver) {
            runObserver();
          }

          if (opts.iterateNone) {
            return clone || ret;
          }

          if (!clone) {
            return ret;
          } // Iterate object or array


          if (stateObj.iterateIn) {
            var _loop = function _loop(key) {
              var ownKeysObj = {
                ownKeys: hasOwn$1.call(value, key)
              };

              _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, function () {
                var kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);

                var val = _encapsulate(kp, value[key], !!cyclic, stateObj, promisesData, resolvingTypesonPromise);

                if (hasConstructorOf(val, TypesonPromise)) {
                  promisesData.push([kp, val, !!cyclic, stateObj, clone, key, stateObj.type]);
                } else if (val !== undefined) {
                  clone[key] = val;
                }
              });
            };

            for (var key in value) {
              _loop(key);
            }

            if (runObserver) {
              runObserver({
                endIterateIn: true,
                end: true
              });
            }
          } else {
            // Note: Non-indexes on arrays won't survive stringify so
            //  somewhat wasteful for arrays, but so too is iterating
            //  all numeric indexes on sparse arrays when not wanted
            //  or filtering own keys for positive integers
            keys(value).forEach(function (key) {
              var kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);
              var ownKeysObj = {
                ownKeys: true
              };

              _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, function () {
                var val = _encapsulate(kp, value[key], !!cyclic, stateObj, promisesData, resolvingTypesonPromise);

                if (hasConstructorOf(val, TypesonPromise)) {
                  promisesData.push([kp, val, !!cyclic, stateObj, clone, key, stateObj.type]);
                } else if (val !== undefined) {
                  clone[key] = val;
                }
              });
            });

            if (runObserver) {
              runObserver({
                endIterateOwn: true,
                end: true
              });
            }
          } // Iterate array for non-own numeric properties (we can't
          //   replace the prior loop though as it iterates non-integer
          //   keys)


          if (stateObj.iterateUnsetNumeric) {
            var vl = value.length;

            var _loop2 = function _loop2(i) {
              if (!(i in value)) {
                // No need to escape numeric
                var kp = keypath + (keypath ? '.' : '') + i;
                var ownKeysObj = {
                  ownKeys: false
                };

                _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, function () {
                  var val = _encapsulate(kp, undefined, !!cyclic, stateObj, promisesData, resolvingTypesonPromise);

                  if (hasConstructorOf(val, TypesonPromise)) {
                    promisesData.push([kp, val, !!cyclic, stateObj, clone, i, stateObj.type]);
                  } else if (val !== undefined) {
                    clone[i] = val;
                  }
                });
              }
            };

            for (var i = 0; i < vl; i++) {
              _loop2(i);
            }

            if (runObserver) {
              runObserver({
                endIterateUnsetNumeric: true,
                end: true
              });
            }
          }

          return clone;
        }
        /**
         *
         * @param {string} keypath
         * @param {*} value
         * @param {object} stateObj
         * @param {array} promisesData
         * @param {boolean} plainObject
         * @param {boolean} resolvingTypesonPromise
         * @param {function} [runObserver]
         * @returns {*}
         */


        function replace(keypath, value, stateObj, promisesData, plainObject, resolvingTypesonPromise, runObserver) {
          // Encapsulate registered types
          var replacers = plainObject ? that.plainObjectReplacers : that.nonplainObjectReplacers;
          var i = replacers.length;

          while (i--) {
            var replacer = replacers[i];

            if (replacer.test(value, stateObj)) {
              var type = replacer.type;

              if (that.revivers[type]) {
                // Record the type only if a corresponding reviver
                //   exists. This is to support specs where only
                //   replacement is done.
                // For example, ensuring deep cloning of the object,
                //   or replacing a type to its equivalent without
                //   the need to revive it.
                var existing = types[keypath]; // type can comprise an array of types (see test
                //   `shouldSupportIntermediateTypes`)

                types[keypath] = existing ? [type].concat(existing) : type;
              } // Now, also traverse the result in case it contains its
              //   own types to replace


              Object.assign(stateObj, {
                type: type,
                replaced: true
              });

              if ((sync || !replacer.replaceAsync) && !replacer.replace) {
                if (runObserver) {
                  runObserver({
                    typeDetected: true
                  });
                }

                return _encapsulate(keypath, value, cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
              }

              if (runObserver) {
                runObserver({
                  replacing: true
                });
              }

              var replaceMethod = sync || !replacer.replaceAsync ? 'replace' : 'replaceAsync';
              return _encapsulate(keypath, replacer[replaceMethod](value, stateObj), cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
            }
          }

          return value;
        }

        return promisesDataRoot.length ? sync && opts.throwOnBadSyncType ? function () {
          throw new TypeError('Sync method requested but async result obtained');
        }() : Promise.resolve(checkPromises(ret, promisesDataRoot)).then(finish) : !sync && opts.throwOnBadSyncType ? function () {
          throw new TypeError('Async method requested but sync result obtained');
        }() // If this is a synchronous request for stringification, yet
        //   a promise is the result, we don't want to resolve leading
        //   to an async result, so we return an array to avoid
        //   ambiguity
        : opts.stringification && sync ? [finish(ret)] : sync ? finish(ret) : Promise.resolve(finish(ret));
      }
      /**
       * Also sync but throws on non-sync result
       * @param {*} obj
       * @param {object} stateObj
       * @param {object} opts
       * @returns {*}
       */

    }, {
      key: "encapsulateSync",
      value: function encapsulateSync(obj, stateObj, opts) {
        return this.encapsulate(obj, stateObj, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: true
        }));
      }
      /**
       * @param {*} obj
       * @param {object} stateObj
       * @param {object} opts
       * @returns {*}
       */

    }, {
      key: "encapsulateAsync",
      value: function encapsulateAsync(obj, stateObj, opts) {
        return this.encapsulate(obj, stateObj, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: false
        }));
      }
      /**
       * Revive an encapsulated object.
       * This method is used internally by `Typeson.parse()`.
       * @param {object} obj - Object to revive. If it has `$types` member, the
       *   properties that are listed there will be replaced with its true type
       *   instead of just plain objects.
       * @param {object} opts
       * @throws TypeError If mismatch between sync/async type and result
       * @returns {Promise|*} If async, returns a Promise that resolves to `*`
       */

    }, {
      key: "revive",
      value: function revive(obj, opts) {
        var types = obj && obj.$types; // No type info added. Revival not needed.

        if (!types) {
          return obj;
        } // Object happened to have own `$types` property but with
        //   no actual types, so we unescape and return that object


        if (types === true) {
          return obj.$;
        }

        opts = _objectSpread({
          sync: true
        }, this.options, opts);
        var _opts3 = opts,
            sync = _opts3.sync;
        var keyPathResolutions = [];
        var stateObj = {};
        var ignore$Types = true; // Special when root object is not a trivial Object, it will
        //   be encapsulated in `$`. It will also be encapsulated in
        //   `$` if it has its own `$` property to avoid ambiguity

        if (types.$ && isPlainObject(types.$)) {
          obj = obj.$;
          types = types.$;
          ignore$Types = false;
        }

        var that = this;

        function revivePlainObjects() {
          // const references = [];
          // const reviveTypes = [];
          var plainObjectTypes = [];
          Object.entries(types).forEach(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                keypath = _ref3[0],
                type = _ref3[1];

            if (type === '#') {
              /*
              references.push({
                  keypath,
                  reference: getByKeyPath(obj, keypath)
              });
              */
              return;
            }

            [].concat(type).forEach(function (type) {
              var _that$revivers$type = _slicedToArray(that.revivers[type], 2),
                  plain = _that$revivers$type[1].plain;

              if (!plain) {
                // reviveTypes.push({keypath, type});
                return;
              }

              plainObjectTypes.push({
                keypath: keypath,
                type: type
              });
              delete types[keypath]; // Avoid repeating
            });
          });

          if (!plainObjectTypes.length) {
            return;
          } // Handle plain object revivers first so reference
          //   setting can use revived type (e.g., array instead
          //   of object); assumes revived has same structure
          //   or will otherwise break subsequent references


          return plainObjectTypes.sort(nestedPathsFirst).reduce(function reducer(possibleTypesonPromise, _ref4) {
            var keypath = _ref4.keypath,
                type = _ref4.type;

            if (hasConstructorOf(possibleTypesonPromise, TypesonPromise)) {
              // TypesonPromise here too
              return possibleTypesonPromise.then(function (v) {
                return reducer(v, type);
              });
            }

            var val = getByKeyPath(obj, keypath);

            if (hasConstructorOf(val, TypesonPromise)) {
              return val.then(function (v) {
                // TypesonPromise here too
                return reducer(v, type);
              });
            }

            var _that$revivers$type2 = _slicedToArray(that.revivers[type], 1),
                reviver = _that$revivers$type2[0];

            if (!reviver) {
              throw new Error('Unregistered type: ' + type);
            }

            val = reviver[sync && reviver.revive ? 'revive' : !sync && reviver.reviveAsync ? 'reviveAsync' : 'revive'](val, stateObj);

            if (val === undefined) {
              return undefined;
            }

            if (hasConstructorOf(val, Undefined)) {
              val = undefined;
            }

            var newVal = setAtKeyPath(obj, keypath, val);

            if (newVal === val) {
              obj = val;
            }

            return undefined;
          }, undefined // This argument must be explicit
          ); // references.forEach(({keypath, reference}) => {});
          // reviveTypes.sort(nestedPathsFirst).forEach(() => {});
        }
        /**
         *
         * @param {string} keypath
         * @param {*} value
         * @param {?(Array|object)} target
         * @param {Array|object} [clone]
         * @param {string} [key]
         * @returns {*}
         */


        function _revive(keypath, value, target, clone, key) {
          if (ignore$Types && keypath === '$types') {
            return undefined;
          }

          var type = types[keypath];

          if (isArray(value) || isPlainObject(value)) {
            var _clone = isArray(value) ? new Array(value.length) : {}; // Iterate object or array


            keys(value).forEach(function (k) {
              var val = _revive(keypath + (keypath ? '.' : '') + escapeKeyPathComponent(k), value[k], target || _clone, _clone, k);

              if (hasConstructorOf(val, Undefined)) {
                _clone[k] = undefined;
              } else if (val !== undefined) {
                _clone[k] = val;
              }
            });
            value = _clone; // Try to resolve cyclic reference as soon as available

            while (keyPathResolutions.length) {
              var _keyPathResolutions$ = _slicedToArray(keyPathResolutions[0], 4),
                  _target = _keyPathResolutions$[0],
                  keyPath = _keyPathResolutions$[1],
                  _clone2 = _keyPathResolutions$[2],
                  k = _keyPathResolutions$[3];

              var val = getByKeyPath(_target, keyPath);

              if (hasConstructorOf(val, Undefined)) {
                _clone2[k] = undefined;
              } else if (val !== undefined) {
                _clone2[k] = val;
              } else {
                break;
              }

              keyPathResolutions.splice(0, 1);
            }
          }

          if (!type) {
            return value;
          }

          if (type === '#') {
            var _ret = getByKeyPath(target, value.slice(1));

            if (_ret === undefined) {
              // Cyclic reference not yet available
              keyPathResolutions.push([target, value.slice(1), clone, key]);
            }

            return _ret;
          }

          return [].concat(type).reduce(function reducer(val, type) {
            if (hasConstructorOf(val, TypesonPromise)) {
              return val.then(function (v) {
                // TypesonPromise here too
                return reducer(v, type);
              });
            }

            var _that$revivers$type3 = _slicedToArray(that.revivers[type], 1),
                reviver = _that$revivers$type3[0];

            if (!reviver) {
              throw new Error('Unregistered type: ' + type);
            }

            return reviver[sync && reviver.revive ? 'revive' : !sync && reviver.reviveAsync ? 'reviveAsync' : 'revive'](val, stateObj);
          }, value);
        }

        function checkUndefined(retrn) {
          return hasConstructorOf(retrn, Undefined) ? undefined : retrn;
        }

        var possibleTypesonPromise = revivePlainObjects();
        var ret;

        if (hasConstructorOf(possibleTypesonPromise, TypesonPromise)) {
          ret = possibleTypesonPromise.then(function () {
            return _revive('', obj, null);
          });
        } else {
          ret = _revive('', obj, null);
        }

        return isThenable(ret) ? sync && opts.throwOnBadSyncType ? function () {
          throw new TypeError('Sync method requested but async result obtained');
        }() : hasConstructorOf(ret, TypesonPromise) ? ret.p.then(checkUndefined) : ret : !sync && opts.throwOnBadSyncType ? function () {
          throw new TypeError('Async method requested but sync result obtained');
        }() : sync ? checkUndefined(ret) : Promise.resolve(checkUndefined(ret));
      }
      /**
       * Also sync but throws on non-sync result
       * @param {*} obj
       * @param {object} opts
       * @returns {*}
       */

    }, {
      key: "reviveSync",
      value: function reviveSync(obj, opts) {
        return this.revive(obj, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: true
        }));
      }
      /**
      * @param {*} obj
      * @param {object} opts
      * @returns {Promise} Resolves to `*`
      */

    }, {
      key: "reviveAsync",
      value: function reviveAsync(obj, opts) {
        return this.revive(obj, _objectSpread({
          throwOnBadSyncType: true
        }, opts, {
          sync: false
        }));
      }
      /**
       * Register types.
       * For examples on how to use this method, see
       *   {@link https://github.com/dfahlander/typeson-registry/tree/master/types}
       * @param {Array.<Object.<string,Function[]>>} typeSpecSets - Types and
       *   their functions [test, encapsulate, revive];
       * @param {object} opts
       * @returns {Typeson}
       */

    }, {
      key: "register",
      value: function register(typeSpecSets, opts) {
        opts = opts || {};
        [].concat(typeSpecSets).forEach(function R(typeSpec) {
          // Allow arrays of arrays of arrays...
          if (isArray(typeSpec)) {
            return typeSpec.map(R, this);
          }

          typeSpec && keys(typeSpec).forEach(function (typeId) {
            if (typeId === '#') {
              throw new TypeError('# cannot be used as a type name as it is reserved ' + 'for cyclic objects');
            } else if (Typeson.JSON_TYPES.includes(typeId)) {
              throw new TypeError('Plain JSON object types are reserved as type names');
            }

            var spec = typeSpec[typeId];
            var replacers = spec.testPlainObjects ? this.plainObjectReplacers : this.nonplainObjectReplacers;
            var existingReplacer = replacers.filter(function (r) {
              return r.type === typeId;
            });

            if (existingReplacer.length) {
              // Remove existing spec and replace with this one.
              replacers.splice(replacers.indexOf(existingReplacer[0]), 1);
              delete this.revivers[typeId];
              delete this.types[typeId];
            }

            if (!spec) {
              return;
            }

            if (typeof spec === 'function') {
              // Support registering just a class without replacer/reviver
              var Class = spec;
              spec = {
                test: function test(x) {
                  return x && x.constructor === Class;
                },
                replace: function replace(x) {
                  return Object.assign({}, x);
                },
                revive: function revive(x) {
                  return Object.assign(Object.create(Class.prototype), x);
                }
              };
            } else if (isArray(spec)) {
              var _spec = spec,
                  _spec2 = _slicedToArray(_spec, 3),
                  test = _spec2[0],
                  replace = _spec2[1],
                  revive = _spec2[2];

              spec = {
                test: test,
                replace: replace,
                revive: revive
              };
            }

            var replacerObj = {
              type: typeId,
              test: spec.test.bind(spec)
            };

            if (spec.replace) {
              replacerObj.replace = spec.replace.bind(spec);
            }

            if (spec.replaceAsync) {
              replacerObj.replaceAsync = spec.replaceAsync.bind(spec);
            }

            var start = typeof opts.fallback === 'number' ? opts.fallback : opts.fallback ? 0 : Infinity;

            if (spec.testPlainObjects) {
              this.plainObjectReplacers.splice(start, 0, replacerObj);
            } else {
              this.nonplainObjectReplacers.splice(start, 0, replacerObj);
            } // Todo: We might consider a testAsync type


            if (spec.revive || spec.reviveAsync) {
              var reviverObj = {};

              if (spec.revive) {
                reviverObj.revive = spec.revive.bind(spec);
              }

              if (spec.reviveAsync) {
                reviverObj.reviveAsync = spec.reviveAsync.bind(spec);
              }

              this.revivers[typeId] = [reviverObj, {
                plain: spec.testPlainObjects
              }];
            } // Record to be retrieved via public types property.


            this.types[typeId] = spec;
          }, this);
        }, this);
        return this;
      }
    }]);

    return Typeson;
  }();
  /**
   * We keep this function minimized so if using two instances of this
   * library, where one is minimized and one is not, it will still work
   * with `hasConstructorOf`.
   * @constructor
   */


  var Undefined = function Undefined() {
    _classCallCheck(this, Undefined);
  }; // eslint-disable-line space-before-blocks
  // The following provide classes meant to avoid clashes with other values
  // To insist `undefined` should be added


  Typeson.Undefined = Undefined; // To support async encapsulation/stringification

  Typeson.Promise = TypesonPromise; // Some fundamental type-checking utilities

  Typeson.isThenable = isThenable;
  Typeson.toStringTag = toStringTag;
  Typeson.hasConstructorOf = hasConstructorOf;
  Typeson.isObject = isObject;
  Typeson.isPlainObject = isPlainObject;
  Typeson.isUserObject = isUserObject;
  Typeson.escapeKeyPathComponent = escapeKeyPathComponent;
  Typeson.unescapeKeyPathComponent = unescapeKeyPathComponent;
  Typeson.getByKeyPath = getByKeyPath;
  Typeson.getJSONType = getJSONType;
  Typeson.JSON_TYPES = ['null', 'boolean', 'number', 'string', 'array', 'object'];

  var arrayNonindexKeys = {
    arrayNonindexKeys: {
      testPlainObjects: true,
      test: function test(x, stateObj) {
        if (Array.isArray(x)) {
          stateObj.iterateIn = 'object';
          stateObj.addLength = true;
          return true;
        }

        return false;
      },
      revive: function revive(o) {
        var arr = []; // No map here as may be a sparse array (including
        //   with `length` set)

        Object.entries(o).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          arr[key] = val;
        });
        return arr;
      }
    }
  };

  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; // Use a lookup table to find the index.

  var lookup = new Uint8Array(256);

  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  var encode = function encode(arraybuffer, byteOffset, length) {
    if (length === null || length === undefined) {
      length = arraybuffer.byteLength; // Needed for Safari
    }

    var bytes = new Uint8Array(arraybuffer, byteOffset || 0, // Default needed for Safari
    length);
    var len = bytes.length;
    var base64 = '';

    for (var _i = 0; _i < len; _i += 3) {
      base64 += chars[bytes[_i] >> 2];
      base64 += chars[(bytes[_i] & 3) << 4 | bytes[_i + 1] >> 4];
      base64 += chars[(bytes[_i + 1] & 15) << 2 | bytes[_i + 2] >> 6];
      base64 += chars[bytes[_i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }

    return base64;
  };

  var decode = function decode(base64) {
    var len = base64.length;
    var bufferLength = base64.length * 0.75;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;

      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (var _i2 = 0; _i2 < len; _i2 += 4) {
      encoded1 = lookup[base64.charCodeAt(_i2)];
      encoded2 = lookup[base64.charCodeAt(_i2 + 1)];
      encoded3 = lookup[base64.charCodeAt(_i2 + 2)];
      encoded4 = lookup[base64.charCodeAt(_i2 + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };

  var arraybuffer = {
    arraybuffer: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'ArrayBuffer';
      },
      replace: function replace(b, stateObj) {
        if (!stateObj.buffers) {
          stateObj.buffers = [];
        }

        var index = stateObj.buffers.indexOf(b);

        if (index > -1) {
          return {
            index: index
          };
        }

        stateObj.buffers.push(b);
        return encode(b);
      },
      revive: function revive(b64, stateObj) {
        if (!stateObj.buffers) {
          stateObj.buffers = [];
        }

        if (_typeof(b64) === 'object') {
          return stateObj.buffers[b64.index];
        }

        var buffer = decode(b64);
        stateObj.buffers.push(buffer);
        return buffer;
      }
    }
  }; // See also typed-arrays!

  var bigintObject = {
    bigintObject: {
      test: function test(x) {
        return _typeof(x) === 'object' && Typeson.hasConstructorOf(x, BigInt);
      },
      replace: function replace(n) {
        return String(n);
      },
      revive: function revive(s) {
        return Object(BigInt(s));
      }
    }
  };

  /* globals BigInt */
  var bigint = {
    bigint: {
      test: function test(x) {
        return typeof x === 'bigint';
      },
      // eslint-disable-line valid-typeof
      replace: function replace(n) {
        return String(n);
      },
      revive: function revive(s) {
        return BigInt(s);
      }
    }
  };

  function string2arraybuffer(str) {
    /*
    // UTF-8 approaches
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        arr[i] = utf8.charCodeAt(i);
    }
    return arr.buffer;
     const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        // surrogate pair
        } else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
    */

    /*
    // Working UTF-16 options (equivalents)
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
    */
    var array = new Uint8Array(str.length);

    for (var i = 0; i < str.length; i++) {
      array[i] = str.charCodeAt(i); // & 0xff;
    }

    return array.buffer;
  }

  var blob = {
    blob: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Blob';
      },
      replace: function replace(b) {
        // Sync
        var req = new XMLHttpRequest();
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.open('GET', URL.createObjectURL(b), false); // Sync

        if (req.status !== 200 && req.status !== 0) {
          throw new Error('Bad Blob access: ' + req.status);
        }

        req.send();
        return {
          type: b.type,
          stringContents: req.responseText
        };
      },
      revive: function revive(_ref) {
        var type = _ref.type,
            stringContents = _ref.stringContents;
        return new Blob([string2arraybuffer(stringContents)], {
          type: type
        });
      },
      replaceAsync: function replaceAsync(b) {
        return new Typeson.Promise(function (resolve, reject) {
          if (b.isClosed) {
            // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
            reject(new Error('The Blob is closed'));
            return;
          }

          var reader = new FileReader();
          reader.addEventListener('load', function () {
            resolve({
              type: b.type,
              stringContents: reader.result
            });
          });
          reader.addEventListener('error', function () {
            reject(reader.error);
          });
          reader.readAsBinaryString(b);
        });
      }
    }
  };

  var cloneableObjectsByUUID = {}; // TODO: We could use `import generateUUID from 'uuid/v4';` (but it needs crypto library, etc.)

  function generateUUID() {
    //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    var d = new Date().getTime();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
  }

  var cloneable = {
    cloneable: {
      test: function test(x) {
        return x && _typeof(x) === 'object' && typeof x[Symbol.for('cloneEncapsulate')] === 'function';
      },
      replace: function replace(cloneable) {
        var encapsulated = cloneable[Symbol.for('cloneEncapsulate')]();
        var uuid = generateUUID();
        cloneableObjectsByUUID[uuid] = cloneable;
        return {
          uuid: uuid,
          encapsulated: encapsulated
        };
      },
      revive: function revive(_ref) {
        var uuid = _ref.uuid,
            encapsulated = _ref.encapsulated;
        return cloneableObjectsByUUID[uuid][Symbol.for('cloneRevive')](encapsulated);
      }
    }
  };

  var dataview = {
    dataview: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'DataView';
      },
      replace: function replace(_ref, stateObj) {
        var buffer = _ref.buffer,
            byteOffset = _ref.byteOffset,
            byteLength = _ref.byteLength;

        if (!stateObj.buffers) {
          stateObj.buffers = [];
        }

        var index = stateObj.buffers.indexOf(buffer);

        if (index > -1) {
          return {
            index: index,
            byteOffset: byteOffset,
            byteLength: byteLength
          };
        }

        stateObj.buffers.push(buffer);
        return {
          encoded: encode(buffer),
          byteOffset: byteOffset,
          byteLength: byteLength
        };
      },
      revive: function revive(b64Obj, stateObj) {
        if (!stateObj.buffers) {
          stateObj.buffers = [];
        }

        var byteOffset = b64Obj.byteOffset,
            byteLength = b64Obj.byteLength,
            encoded = b64Obj.encoded,
            index = b64Obj.index;
        var buffer;

        if ('index' in b64Obj) {
          buffer = stateObj.buffers[index];
        } else {
          buffer = decode(encoded);
          stateObj.buffers.push(buffer);
        }

        return new DataView(buffer, byteOffset, byteLength);
      }
    }
  };

  var date = {
    date: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Date';
      },
      replace: function replace(date) {
        var time = date.getTime();

        if (isNaN(time)) {
          return 'NaN';
        }

        return time;
      },
      revive: function revive(time) {
        if (time === 'NaN') {
          return new Date(NaN);
        }

        return new Date(time);
      }
    }
  };

  var error = {
    error: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Error';
      },
      replace: function replace(_ref) {
        var name = _ref.name,
            message = _ref.message;
        return {
          name: name,
          message: message
        };
      },
      revive: function revive(_ref2) {
        var name = _ref2.name,
            message = _ref2.message;
        var e = new Error(message);
        e.name = name;
        return e;
      }
    }
  }; // See also errors.js that may be registered after having registered this type.

  /* eslint-env browser, node */

  var _global = typeof self === 'undefined' ? global : self;

  var exportObj = {}; // Comprises all built-in errors.

  ['TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'EvalError', 'URIError', 'InternalError' // non-standard
  ].forEach(function (errName) {
    var constructor = _global[errName];

    if (constructor) {
      exportObj[errName.toLowerCase()] = {
        test: function test(x) {
          return Typeson.hasConstructorOf(x, constructor);
        },
        replace: function replace(e) {
          return e.message;
        },
        revive: function revive(message) {
          return new constructor(message);
        }
      };
    }
  });

  var file = {
    file: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'File';
      },
      replace: function replace(f) {
        // Sync
        var req = new XMLHttpRequest();
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.open('GET', URL.createObjectURL(f), false); // Sync

        if (req.status !== 200 && req.status !== 0) {
          throw new Error('Bad Blob access: ' + req.status);
        }

        req.send();
        return {
          type: f.type,
          stringContents: req.responseText,
          name: f.name,
          lastModified: f.lastModified
        };
      },
      revive: function revive(_ref) {
        var name = _ref.name,
            type = _ref.type,
            stringContents = _ref.stringContents,
            lastModified = _ref.lastModified;
        return new File([string2arraybuffer(stringContents)], name, {
          type: type,
          lastModified: lastModified
        });
      },
      replaceAsync: function replaceAsync(f) {
        return new Typeson.Promise(function (resolve, reject) {
          if (f.isClosed) {
            // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
            reject(new Error('The File is closed'));
            return;
          }

          var reader = new FileReader();
          reader.addEventListener('load', function () {
            resolve({
              type: f.type,
              stringContents: reader.result,
              name: f.name,
              lastModified: f.lastModified
            });
          });
          reader.addEventListener('error', function () {
            reject(reader.error);
          });
          reader.readAsBinaryString(f);
        });
      }
    }
  };

  var filelist = {
    file: file.file,
    filelist: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'FileList';
      },
      replace: function replace(fl) {
        var arr = [];

        for (var i = 0; i < fl.length; i++) {
          arr[i] = fl.item(i);
        }

        return arr;
      },
      revive: function revive(o) {
        function FileList() {
          this._files = arguments[0];
          this.length = this._files.length;
        }

        FileList.prototype.item = function (index) {
          return this._files[index];
        };

        FileList.prototype[Symbol.toStringTag] = 'FileList';
        return new FileList(o);
      }
    }
  };

  /** ImageBitmap is browser / DOM specific. It also can only work same-domain (or CORS)
  */
  var imagebitmap = {
    imagebitmap: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'ImageBitmap' || // In Node, our polyfill sets the dataset on a canvas element as JSDom no longer allows overriding toStringTag
        x && x.dataset && x.dataset.toStringTag === 'ImageBitmap';
      },
      replace: function replace(bm) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bm, 0, 0); // Although `width` and `height` are part of `ImageBitMap`, these will
        //   be auto-created for us when reviving with the data URL (and they are
        //   not settable even if they weren't)
        // return {width: bm.width, height: bm.height, dataURL: canvas.toDataURL()};

        return canvas.toDataURL();
      },
      revive: function revive(o) {
        /*
        var req = new XMLHttpRequest();
        req.open('GET', o, false); // Sync
        if (req.status !== 200 && req.status !== 0) throw new Error('Bad ImageBitmap access: ' + req.status);
        req.send();
        return req.responseText;
        */
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img'); // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
        };

        img.src = o;
        return canvas; // Works in contexts allowing an ImageBitmap (We might use `OffscreenCanvas.transferToBitmap` when supported)
      },
      reviveAsync: function reviveAsync(o) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img'); // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
        };

        img.src = o; // o.dataURL;

        return createImageBitmap(canvas); // Returns a promise
      }
    }
  };

  /** ImageData is browser / DOM specific (though `node-canvas` has it available on `Canvas`).
  */
  var imagedata = {
    imagedata: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'ImageData';
      },
      replace: function replace(d) {
        return {
          array: Array.from(d.data),
          // Ensure `length` gets preserved for revival
          width: d.width,
          height: d.height
        };
      },
      revive: function revive(o) {
        return new ImageData(new Uint8ClampedArray(o.array), o.width, o.height);
      }
    }
  };

  var infinity = {
    infinity: {
      test: function test(x) {
        return x === Infinity;
      },
      replace: function replace(n) {
        return 'Infinity';
      },
      revive: function revive(s) {
        return Infinity;
      }
    }
  };

  var IntlCollator = {
    test: function test(x) {
      return Typeson.hasConstructorOf(x, Intl.Collator);
    },
    replace: function replace(c) {
      return c.resolvedOptions();
    },
    revive: function revive(options) {
      return new Intl.Collator(options.locale, options);
    }
  };
  var IntlDateTimeFormat = {
    test: function test(x) {
      return Typeson.hasConstructorOf(x, Intl.DateTimeFormat);
    },
    replace: function replace(dtf) {
      return dtf.resolvedOptions();
    },
    revive: function revive(options) {
      return new Intl.DateTimeFormat(options.locale, options);
    }
  };
  var IntlNumberFormat = {
    test: function test(x) {
      return Typeson.hasConstructorOf(x, Intl.NumberFormat);
    },
    replace: function replace(nf) {
      return nf.resolvedOptions();
    },
    revive: function revive(options) {
      return new Intl.NumberFormat(options.locale, options);
    }
  };
  var intlTypes = {
    IntlCollator: IntlCollator,
    IntlDateTimeFormat: IntlDateTimeFormat,
    IntlNumberFormat: IntlNumberFormat
  };

  var map = {
    map: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Map';
      },
      replace: function replace(map) {
        return Array.from(map.entries());
      },
      revive: function revive(entries) {
        return new Map(entries);
      }
    }
  };

  var nan = {
    nan: {
      test: function test(x) {
        return typeof x === 'number' && isNaN(x);
      },
      replace: function replace(n) {
        return 'NaN';
      },
      revive: function revive(s) {
        return NaN;
      }
    }
  };

  var NegativeInfinity = {
    negativeInfinity: {
      test: function test(x) {
        return x === -Infinity;
      },
      replace: function replace(n) {
        return '-Infinity';
      },
      revive: function revive(s) {
        return -Infinity;
      }
    }
  };

  var nonbuiltinIgnore = {
    nonbuiltinIgnore: {
      test: function test(x) {
        return x && _typeof(x) === 'object' && !Array.isArray(x) && !['Object', // `Proxy` and `Reflect`, two other built-in objects, will also
        //   have a `toStringTag` of `Object`; we don't want built-in
        //   function objects, however
        'Boolean', 'Number', 'String', 'Error', 'RegExp', 'Math', 'Date', 'Map', 'Set', 'JSON', 'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'Promise', 'String Iterator', 'Array Iterator', 'Map Iterator', 'Set Iterator', 'WeakMap', 'WeakSet', 'Atomics', 'Module'].includes(Typeson.toStringTag(x));
      },
      replace: function replace(rexp) {}
    }
  };

  var primitiveObjects = {
    // String Object (not primitive string which need no type spec)
    StringObject: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'String' && _typeof(x) === 'object';
      },
      replace: function replace(s) {
        return String(s);
      },
      // convert to primitive string
      revive: function revive(s) {
        return new String(s);
      } // Revive to an objectified string

    },
    // Boolean Object (not primitive boolean which need no type spec)
    BooleanObject: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Boolean' && _typeof(x) === 'object';
      },
      replace: function replace(b) {
        return Boolean(b);
      },
      // convert to primitive boolean
      revive: function revive(b) {
        return new Boolean(b);
      } // Revive to an objectified Boolean

    },
    // Number Object (not primitive number which need no type spec)
    NumberObject: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Number' && _typeof(x) === 'object';
      },
      replace: function replace(n) {
        return Number(n);
      },
      // convert to primitive number
      revive: function revive(n) {
        return new Number(n);
      } // Revive to an objectified number

    }
  };
  /* eslint-enable no-new-wrappers */

  var regexp = {
    regexp: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'RegExp';
      },
      replace: function replace(rexp) {
        return {
          source: rexp.source,
          flags: (rexp.global ? 'g' : '') + (rexp.ignoreCase ? 'i' : '') + (rexp.multiline ? 'm' : '') + (rexp.sticky ? 'y' : '') + (rexp.unicode ? 'u' : '')
        };
      },
      revive: function revive(_ref) {
        var source = _ref.source,
            flags = _ref.flags;
        return new RegExp(source, flags);
      }
    }
  };

  // Here we allow the exact same non-plain object, function, and symbol instances to
  //  be resurrected (assuming the same session/environment); plain objects are
  //  ignored by Typeson so not presently available and we consciously exclude arrays
  var resurrectableObjectsByUUID = {}; // TODO: We could use `import generateUUID from 'uuid/v4';` (but it needs crypto library, etc.)

  function generateUUID$1() {
    //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    var d = new Date().getTime();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
  }

  var resurrectable = {
    resurrectable: {
      test: function test(x) {
        return x && !Array.isArray(x) && ['object', 'function', 'symbol'].includes(_typeof(x));
      },
      replace: function replace(resurrectable) {
        var uuid = generateUUID$1();
        resurrectableObjectsByUUID[uuid] = resurrectable;
        return uuid;
      },
      revive: function revive(serializedResurrectable) {
        return resurrectableObjectsByUUID[serializedResurrectable];
      }
    }
  };

  var set$1 = {
    set: {
      test: function test(x) {
        return Typeson.toStringTag(x) === 'Set';
      },
      replace: function replace(set) {
        return Array.from(set.values());
      },
      revive: function revive(values) {
        return new Set(values);
      }
    }
  };

  /* eslint-env browser, node */

  var _global$1 = typeof self === 'undefined' ? global : self; // Support all kinds of typed arrays (views of ArrayBuffers)


  var exportObj$1 = {};
  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'].forEach(function (typeName) {
    var arrType = typeName;
    var TypedArray = _global$1[typeName];

    if (TypedArray) {
      exportObj$1[typeName.toLowerCase()] = {
        test: function test(x) {
          return Typeson.toStringTag(x) === arrType;
        },
        replace: function replace(a) {
          return (a.byteOffset === 0 && a.byteLength === a.buffer.byteLength ? a // socket.io supports streaming ArrayBuffers. If we have a typed array
          // representing a portion of the buffer, we need to clone the buffer before leaving it
          // to socket.io.
          : a.slice(0)).buffer;
        },
        revive: function revive(buf) {
          // One may configure socket.io to revive binary data as Buffer or Blob.
          // We should therefore not rely on that the instance we get here is an ArrayBuffer
          // If not, let's assume user wants to receive it as configured with socket.io.
          return Typeson.toStringTag(buf) === 'ArrayBuffer' ? new TypedArray(buf) : buf;
        }
      };
    }
  });

  /* eslint-env browser, node */

  var _global$2 = typeof self === 'undefined' ? global : self;

  var exportObj$2 = {};
  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'].forEach(function (typeName) {
    var arrType = typeName;
    var TypedArray = _global$2[arrType];

    if (TypedArray) {
      exportObj$2[typeName.toLowerCase()] = {
        test: function test(x) {
          return Typeson.toStringTag(x) === arrType;
        },
        replace: function replace(_ref, stateObj) {
          var buffer = _ref.buffer,
              byteOffset = _ref.byteOffset,
              length = _ref.length;

          if (!stateObj.buffers) {
            stateObj.buffers = [];
          }

          var index = stateObj.buffers.indexOf(buffer);

          if (index > -1) {
            return {
              index: index,
              byteOffset: byteOffset,
              length: length
            };
          }

          stateObj.buffers.push(buffer);
          return {
            encoded: encode(buffer),
            byteOffset: byteOffset,
            length: length
          };
        },
        revive: function revive(b64Obj, stateObj) {
          if (!stateObj.buffers) {
            stateObj.buffers = [];
          }

          var byteOffset = b64Obj.byteOffset,
              length = b64Obj.length,
              encoded = b64Obj.encoded,
              index = b64Obj.index;
          var buffer;

          if ('index' in b64Obj) {
            buffer = stateObj.buffers[index];
          } else {
            buffer = decode(encoded);
            stateObj.buffers.push(buffer);
          }

          return new TypedArray(buffer, byteOffset, length);
        }
      };
    }
  });

  // This does not preserve `undefined` in sparse arrays; see the `undefined` or `sparse-undefined` preset
  var undef = {
    undef: {
      test: function test(x, stateObj) {
        return typeof x === 'undefined' && (stateObj.ownKeys || !('ownKeys' in stateObj));
      },
      replace: function replace(n) {
        return null;
      },
      revive: function revive(s) {
        return new Typeson.Undefined();
      } // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)

    }
  };

  var userObject = {
    userObject: {
      test: function test(x, stateObj) {
        return Typeson.isUserObject(x);
      },
      replace: function replace(n) {
        return Object.assign({}, n);
      },
      revive: function revive(s) {
        return s;
      }
    }
  };

  var specialNumbers = [nan, infinity, NegativeInfinity];

  /* This preset includes types that are built-in into the JavaScript
      language itself, this should work universally.

    Types that were added in ES6 or beyond will be checked before inclusion
     so that this module can be consumed by both ES5 and ES6 environments.

    Some types cannot be encapsulated because their inner state is private:
      `WeakMap`, `WeakSet`.

    The Function type is not included because their closures would not be
      serialized, so a revived Function that uses closures would not behave
      as expected.

    Symbols are similarly not included.
  */
  var expObj = [undef, // ES5
  arrayNonindexKeys, primitiveObjects, specialNumbers, date, error, exportObj, regexp].concat( // ES2015 (ES6)
  typeof Map === 'function' ? map : [], typeof Set === 'function' ? set$1 : [], typeof ArrayBuffer === 'function' ? arraybuffer : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview : [], typeof Intl !== 'undefined' ? intlTypes : [], typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []);

  /** When communicating via postMessage() (Worker.postMessage() or window.postMessage()),
   * the browser will use a similar algorithm as Typeson does to encapsulate and revive all
   * items in the structure (aka the structured clone algorithm). This algorithm supports all
   * built-in types as well as many DOM types. Therefore, only types that
   * are not included in the structured clone algorithm need to be registered, which is:
   * * Error
   * * Specific Errors like SyntaxError, TypeError, etc.
   * * Any custom type you want to send across window- or worker boundraries
   * This preset will only include the Error types and you can register your custom types
   * after having registered these.
   */
  var postMessage = [error, exportObj];

  var socketio = [expObj, {
    ArrayBuffer: null
  }, // Leave ArrayBuffer as is, and let socket.io stream it instead.
  exportObj$1 // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
  ];

  var sparseUndefined = [{
    sparseArrays: {
      testPlainObjects: true,
      test: function test(x) {
        return Array.isArray(x);
      },
      replace: function replace(a, stateObj) {
        stateObj.iterateUnsetNumeric = true;
        return a;
      }
    }
  }, {
    sparseUndefined: {
      test: function test(x, stateObj) {
        return typeof x === 'undefined' && stateObj.ownKeys === false;
      },
      replace: function replace(n) {
        return null;
      },
      revive: function revive(s) {
        return undefined;
      } // Will avoid adding anything

    }
  }];

  /* This preset includes types for the Structured Cloning Algorithm. */
  var expObj$1 = [// Todo: Might also register synchronous `ImageBitmap` and `Blob`/`File`/`FileList`?
  // ES5
  userObject, // Processed last (non-builtin)
  undef, arrayNonindexKeys, primitiveObjects, specialNumbers, date, regexp, // Non-built-ins
  imagedata, imagebitmap, // Async return
  file, filelist, blob].concat( // ES2015 (ES6)
  typeof Map === 'function' ? map : [], typeof Set === 'function' ? set$1 : [], typeof ArrayBuffer === 'function' ? arraybuffer : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview : [], typeof Intl !== 'undefined' ? intlTypes : [], typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []);

  var structuredCloningThrowing = expObj$1.concat({
    checkDataCloneException: [function (val) {
      // Should also throw with:
      // 1. `IsDetachedBuffer` (a process not called within the ECMAScript spec)
      // 2. `IsCallable` (covered by `typeof === 'function'` or a function's `toStringTag`)
      // 3. internal slots besides [[Prototype]] or [[Extensible]] (e.g., [[PromiseState]] or [[WeakMapData]])
      // 4. exotic object (e.g., `Proxy`) (which does not have default behavior for one or more of the
      //      essential internal methods that are limited to the following for non-function objects (we auto-exclude functions):
      //      [[GetPrototypeOf]],[[SetPrototypeOf]],[[IsExtensible]],[[PreventExtensions]],[[GetOwnProperty]],
      //      [[DefineOwnProperty]],[[HasProperty]],[[Get]],[[Set]],[[Delete]],[[OwnPropertyKeys]]);
      //      except for the standard, built-in exotic objects, we'd need to know whether these methods had distinct behaviors
      // Note: There is no apparent way for us to detect a `Proxy` and reject (Chrome at least is not rejecting anyways)
      var stringTag = {}.toString.call(val).slice(8, -1);

      if (['symbol', // Symbol's `toStringTag` is only "Symbol" for its initial value, so we check `typeof`
      'function' // All functions including bound function exotic objects
      ].includes(_typeof(val)) || ['Arguments', // A non-array exotic object
      'Module', // A non-array exotic object
      'Error', // `Error` and other errors have the [[ErrorData]] internal slot and give "Error"
      'Promise', // Promise instances have an extra slot ([[PromiseState]]) but not throwing in Chrome `postMessage`
      'WeakMap', // WeakMap instances have an extra slot ([[WeakMapData]]) but not throwing in Chrome `postMessage`
      'WeakSet' // WeakSet instances have an extra slot ([[WeakSetData]]) but not throwing in Chrome `postMessage`
      ].includes(stringTag) || val === Object.prototype || // A non-array exotic object but not throwing in Chrome `postMessage`
      (stringTag === 'Blob' || stringTag === 'File') && val.isClosed || val && _typeof(val) === 'object' && // Duck-type DOM node objects (non-array exotic? objects which
      //    cannot be cloned by the SCA)
      typeof val.nodeType === 'number' && typeof val.insertBefore === 'function') {
        throw new DOMException('The object cannot be cloned.', 'DataCloneError');
      }

      return false;
    }]
  });

  var undef2 = [sparseUndefined, undef];

  var universal = [expObj // TODO: Add types that are de-facto universal even though not built-in into ecmasript standard.
  ];

  // This file is auto-generated from `build.js`
  Typeson.types = {
    arrayNonindexKeys: arrayNonindexKeys,
    arraybuffer: arraybuffer,
    bigintObject: bigintObject,
    bigint: bigint,
    blob: blob,
    cloneable: cloneable,
    dataview: dataview,
    date: date,
    error: error,
    errors: exportObj,
    file: file,
    filelist: filelist,
    imagebitmap: imagebitmap,
    imagedata: imagedata,
    infinity: infinity,
    intlTypes: intlTypes,
    map: map,
    nan: nan,
    negativeInfinity: NegativeInfinity,
    nonbuiltinIgnore: nonbuiltinIgnore,
    primitiveObjects: primitiveObjects,
    regexp: regexp,
    resurrectable: resurrectable,
    set: set$1,
    typedArraysSocketio: exportObj$1,
    typedArrays: exportObj$2,
    undef: undef,
    userObject: userObject
  };
  Typeson.presets = {
    builtin: expObj,
    postMessage: postMessage,
    socketio: socketio,
    sparseUndefined: sparseUndefined,
    specialNumbers: specialNumbers,
    structuredCloningThrowing: structuredCloningThrowing,
    structuredCloning: expObj$1,
    undef: undef2,
    universal: universal
  };

  /* eslint-env node */
  // Imperfectly polyfill jsdom for testing `Blob`/`File`
  // Todo: These can be removed once `URL.createObjectURL` may
  //    be implemented in jsdom: https://github.com/jsdom/jsdom/issues/1721
  //    though local-xmlhttprequest may need to be adapted
  // These are not working well with Rollup as imports
  var mod = typeof module !== 'undefined';

  var uuid = mod && require('uuid/v4');

  var whatwgURL = mod && require('whatwg-url') || {}; // We also need to tweak `XMLHttpRequest` which our types
  //    rely on to obtain the Blob/File content

  var utils = mod && require('jsdom/lib/jsdom/living/generated/utils') || {};
  var serializeURLOrigin = whatwgURL.serializeURLOrigin,
      parseURL = whatwgURL.parseURL;
  var blobURLs = {};

  var createObjectURL = function createObjectURL(blob) {
    // https://github.com/jsdom/jsdom/issues/1721#issuecomment-282465529
    var blobURL = 'blob:' + serializeURLOrigin(parseURL(location.href)) + '/' + uuid();
    blobURLs[blobURL] = blob;
    return blobURL;
  };

  var impl = utils.implSymbol;
  var _xhropen = XMLHttpRequest.prototype.open;
  var _xhrOverrideMimeType = XMLHttpRequest.prototype.overrideMimeType; // We only handle the case of binary, so no need to override `open`
  //   in all cases; but this only works if override is called first

  var xmlHttpRequestOverrideMimeType = function xmlHttpRequestOverrideMimeType() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        polyfillDataURLs = _ref.polyfillDataURLs;

    return function (mimeType) {
      if (mimeType === 'text/plain; charset=x-user-defined') {
        this.open = function (method, url, async) {
          if (/^blob:/.test(url)) {
            var blob = blobURLs[url];
            var responseType = 'text/plain'; // blob.type;

            var encoded = blob[impl]._buffer.toString('binary'); // utf16le and base64 both convert lone surrogates
            // Not usable in jsdom which makes properties readonly,
            //   but local-xmlhttprequest can use (and jsdom can
            //   handle data URLs anyways)


            if (polyfillDataURLs) {
              this.status = 200;

              this.send = function () {};

              this.responseType = responseType;
              this.responseText = encoded || '';
              return;
            }

            url = 'data:' + responseType + ',' + encodeURIComponent(encoded);
          }

          return _xhropen.call(this, method, url, async);
        };
      }

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return _xhrOverrideMimeType.call.apply(_xhrOverrideMimeType, [this, mimeType].concat(args));
    };
  };

  /* eslint-env mocha, node */

  if (!URL.createObjectURL) {
    URL.createObjectURL = createObjectURL;
    XMLHttpRequest.prototype.overrideMimeType = xmlHttpRequestOverrideMimeType();
  } // Setup Mocha and Chai


  mocha.setup({
    ui: 'bdd',
    timeout: 5000
  }); // No means to set a `FileList` currently in jsdom so we
  //   make our own `FileList`; Todo: jsdom should really support this:
  //   https://github.com/tmpvar/jsdom/issues/1272

  var glob = typeof module !== 'undefined' ? global : window;

  function FileList$1() {
    this._files = arguments[0];
    this.length = this._files.length;
  }

  FileList$1.prototype.item = function (index) {
    return this._files[index];
  };

  FileList$1.prototype[Symbol.toStringTag] = 'FileList';
  Object.defineProperty(glob.HTMLInputElement.prototype, 'files', {
    get: function get() {
      return new FileList$1(this._files);
    },
    set: function set(val) {
      this._files = val;
    }
  });
  glob.FileList = FileList$1;
  glob.expect = chai.expect;
  glob.assert = chai.assert;
   // Just add a placeholder for tests.js

  function Person(name, age, dob, isMarried) {
    name && (this.name = name);
    age && (this.age = age);
    dob && (this.dob = dob);
    isMarried && (this.isMarried = isMarried);
  }

  Person.prototype.name = '';
  Person.prototype.age = 0;
  Person.prototype.dob = new Date(1900, 0, 1);
  Person.prototype.isMarried = false;

  function SimulatedNonBuiltIn() {
    this.aaa = 5;
  }

  SimulatedNonBuiltIn.prototype.bbb = 8;
  SimulatedNonBuiltIn.prototype[Symbol.toStringTag] = 'SimulatedNonBuiltIn';

  function MyCloneable(obj) {
    this.obj = obj;
    this.nonpersistentStateInfo = Math.random();
  }

  MyCloneable.prototype[Symbol.for('cloneEncapsulate')] = function () {
    return {
      obj: JSON.stringify(this.obj)
    };
  };

  MyCloneable.prototype[Symbol.for('cloneRevive')] = function (encapsulatedMyCloneable) {
    return new MyCloneable(JSON.parse(encapsulatedMyCloneable.obj));
  };

  MyCloneable.prototype.prototypeProperty = 10;

  function MyResurrectable() {}

  var util = {
    Person: Person,
    SimulatedNonBuiltIn: SimulatedNonBuiltIn,
    MyCloneable: MyCloneable,
    MyResurrectable: MyResurrectable
  };

  var _Typeson$types = Typeson.types,
      errors = _Typeson$types.errors,
      typedArrays = _Typeson$types.typedArrays,
      intlTypes$1 = _Typeson$types.intlTypes,
      undef$1 = _Typeson$types.undef,
      primitiveObjects$1 = _Typeson$types.primitiveObjects,
      nan$1 = _Typeson$types.nan,
      infinity$1 = _Typeson$types.infinity,
      negativeInfinity = _Typeson$types.negativeInfinity,
      date$1 = _Typeson$types.date,
      error$1 = _Typeson$types.error,
      regexp$1 = _Typeson$types.regexp,
      map$1 = _Typeson$types.map,
      set$2 = _Typeson$types.set,
      arraybuffer$1 = _Typeson$types.arraybuffer,
      dataview$1 = _Typeson$types.dataview,
      imagedata$1 = _Typeson$types.imagedata,
      imagebitmap$1 = _Typeson$types.imagebitmap,
      blob$1 = _Typeson$types.blob,
      file$1 = _Typeson$types.file,
      filelist$1 = _Typeson$types.filelist,
      nonbuiltinIgnore$1 = _Typeson$types.nonbuiltinIgnore,
      userObject$1 = _Typeson$types.userObject,
      cloneable$1 = _Typeson$types.cloneable,
      resurrectable$1 = _Typeson$types.resurrectable,
      bigint$1 = _Typeson$types.bigint,
      bigintObject$1 = _Typeson$types.bigintObject,
      _Typeson$presets = Typeson.presets,
      builtin = _Typeson$presets.builtin,
      universal$1 = _Typeson$presets.universal,
      structuredCloningThrowing$1 = _Typeson$presets.structuredCloningThrowing,
      structuredCloning = _Typeson$presets.structuredCloning,
      specialNumbers$1 = _Typeson$presets.specialNumbers,
      postMessage$1 = _Typeson$presets.postMessage,
      undefPreset = _Typeson$presets.undef,
      sparseUndefined$1 = _Typeson$presets.sparseUndefined;

  function ErrorAndErrors(preset) {
    describe('Error and Errors', function () {
      it('should get back real Error instances corresponding to their types and with the original name and message', function () {
        var typeson = new Typeson().register(preset || [error$1, errors]);
        var json = typeson.stringify({
          e1: new Error('Error1'),
          e2: new TypeError('Error2'),
          e3: new RangeError('Error3'),
          e4: new SyntaxError('Error4'),
          e5: new ReferenceError('Error5') // , e6: new InternalError('Error6')

        });
        var obj = typeson.parse(json);
        expect(obj.e1).to.be.an.instanceOf(Error);
        expect(obj.e1.name).to.equal('Error');
        expect(obj.e2).to.be.an.instanceOf(TypeError);
        expect(obj.e2.name).to.equal('TypeError');
        expect(obj.e3).to.be.an.instanceOf(RangeError);
        expect(obj.e3.name).to.equal('RangeError');
        expect(obj.e4).to.be.an.instanceOf(SyntaxError);
        expect(obj.e4.name).to.equal('SyntaxError');
        expect(obj.e5).to.be.an.instanceOf(ReferenceError);
        expect(obj.e5.name).to.equal('ReferenceError'); // Non-standard
        // expect(obj.e6).to.be.an.instanceOf(InternalError);
        // expect(obj.e6.name).to.equal('InternalError');
      });
    });
  }

  function SpecialNumbers(preset) {
    describe('Special numbers', function () {
      it('NaN', function () {
        var typeson = new Typeson().register(preset || nan$1);
        var tson = typeson.stringify(NaN, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.be.NaN;
      });
      it('Infinity', function () {
        var typeson = new Typeson().register(preset || infinity$1);
        var tson = typeson.stringify(Infinity, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.equal(Infinity);
      });
      it('-Infinity', function () {
        var typeson = new Typeson().register(preset || negativeInfinity);
        var tson = typeson.stringify(-Infinity, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.equal(-Infinity);
      });
      it('should not mistake string forms of the special numbers', function () {
        var typeson = new Typeson().register(preset || [nan$1, infinity$1, negativeInfinity]);
        var tson = typeson.stringify('NaN', null, 2);
        var back = typeson.parse(tson);
        expect(back).to.equal('NaN');
        tson = typeson.stringify('Infinity', null, 2);
        back = typeson.parse(tson);
        expect(back).to.equal('Infinity');
        tson = typeson.stringify('-Infinity', null, 2);
        back = typeson.parse(tson);
        expect(back).to.equal('-Infinity');
      });
      it('should not disturb encoding of normal numbers', function () {
        var typeson = new Typeson().register(preset || [nan$1, infinity$1, negativeInfinity]);
        var tson = typeson.stringify(512, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.equal(512);
      });
    });
  }

  function Undefined$1(preset) {
    describe('undefined type', function () {
      it('should be possible to restore `undefined` properties', function () {
        var typeson = new Typeson().register(preset || undef$1);
        var a = [undefined, {
          b: undefined,
          c: [3, null,, undefined]
        }]; // eslint-disable-line no-sparse-arrays

        var json = typeson.stringify(a);
        var a2 = typeson.parse(json);
        expect(a2.length).to.equal(2);
        expect(a2[0]).to.equal(undefined);
        expect(a2[1].b).to.equal(undefined);
        expect('b' in a2[1]).to.be.true;
        expect(a2[1].c[0]).to.equal(3);
        expect(a2[1].c[1]).to.equal(null);
        expect(a2[1].c[3]).to.equal(undefined);
        expect('0' in a2).to.be.true;
        expect('b' in a2[1]).to.be.true;
        expect('1' in a2[1].c).to.be.true;
        expect('3' in a2[1].c).to.be.true;

        if (preset) {
          expect(a2[1].c[2]).to.equal(undefined);
          expect('2' in a2[1].c).to.be.false;
        } else {
          expect(a2[1].c[2]).to.not.equal(undefined);
          expect(a2[1].c[2]).to.equal(null);
          expect('2' in a2[1].c).to.be.true;
        }
      });
      it('should be possible to restore `undefined` at root', function () {
        var typeson = new Typeson().register(preset || undef$1);
        var tson = typeson.stringify(undefined);
        expect(tson).to.equal('{"$":null,"$types":{"$":{"":"undef"}}}');
        var back = typeson.parse(tson);
        expect(back).to.be.undefined;
      });
    });
  }

  function BuiltIn(preset) {
    Undefined$1(preset);
    describe('Primitive objects', function () {
      it('String object', function () {
        var typeson = new Typeson().register(preset || primitiveObjects$1);
        var strObj = new String('hello'); // eslint-disable-line no-new-wrappers

        var tson = typeson.stringify(strObj, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.be.an.instanceOf(String);
        expect(back.valueOf()).to.equal('hello');
        expect(back.length).to.equal(5);
      });
      it('Boolean object', function () {
        var typeson = new Typeson().register(preset || primitiveObjects$1);
        var strObj = new Boolean(true); // eslint-disable-line no-new-wrappers

        var tson = typeson.stringify(strObj, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.be.an.instanceOf(Boolean);
        expect(back.valueOf()).to.equal(true);
      });
      it('Number object', function () {
        var typeson = new Typeson().register(preset || primitiveObjects$1);
        var strObj = new Number(456); // eslint-disable-line no-new-wrappers

        var tson = typeson.stringify(strObj, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.be.an.instanceOf(Number);
        expect(back.valueOf()).to.equal(456);
      });
    });
    SpecialNumbers();
    describe('Date', function () {
      it('should get back a real Date instance with the original time milliseconds', function () {
        var typeson = new Typeson().register(preset || date$1);
        var json = typeson.stringify(new Date(1234567));
        var obj = typeson.parse(json);
        expect(obj).to.be.an.instanceOf(Date);
        expect(obj.getTime()).to.equal(1234567);
      });
      it('should get back a real invalid Date instance', function () {
        var typeson = new Typeson().register(preset || date$1);
        var json = typeson.stringify(new Date(NaN));
        var obj = typeson.parse(json);
        expect(obj).to.be.an.instanceOf(Date);
        expect(obj.getTime()).to.be.NaN;
      });
    });
    ErrorAndErrors(preset);
    describe('RegExp', function () {
      it('should return a RegExp', function () {
        var typeson = new Typeson().register(preset || [regexp$1]);
        var regex = new RegExp('ab?c', 'guy');
        var tson = typeson.stringify(regex, null, 2);
        var back = typeson.parse(tson);
        expect(back instanceof RegExp);
        expect(back.global).to.equal(true);
        expect(back.unicode).to.equal(true);
        expect(back.sticky).to.equal(true);
        expect(back.ignoreCase).to.equal(false);
        expect(back.multiline).to.equal(false);
        expect(back.source).to.equal('ab?c');
        regex = /ab?c/im;
        tson = typeson.stringify(regex, null, 2);
        back = typeson.parse(tson);
        expect(back instanceof RegExp);
        expect(back.global).to.equal(false);
        expect(back.unicode).to.equal(false);
        expect(back.sticky).to.equal(false);
        expect(back.ignoreCase).to.equal(true);
        expect(back.multiline).to.equal(true);
        expect(back.source).to.equal('ab?c');
      });
    });
    describe('Map', function () {
      it('should get back a real Map instance with the original data and use complex types also in contained items', function () {
        var typeson = new Typeson().register(preset || map$1);
        var map1 = new Map();
        var error = new Error('Error here'),
            date = new Date(10000);
        map1.set(error, date);
        var json = typeson.stringify({
          m: map1
        });
        var obj = typeson.parse(json);
        expect(obj.m).to.be.an.instanceOf(Map);

        if (preset) {
          expect(Array.from(obj.m.keys())[0]).to.be.an.instanceOf(Error);
          expect(Array.from(obj.m.values())[0]).to.be.an.instanceOf(Date);
        }
      });
    });
    describe('Set', function () {
      it('should get back a real Set instance with the original data and use complex types also in contained items', function () {
        var typeson = new Typeson().register(preset || set$2);
        var set1 = new Set();
        var error = new Error('Error here'),
            date = new Date(10000),
            str = '',
            o = {
          a: error
        };
        set1.add(o);
        set1.add(date);
        set1.add(str);
        var json = typeson.stringify({
          s: set1
        });
        var obj = typeson.parse(json);
        expect(obj.s).to.be.an.instanceOf(Set);
        var a = Array.from(obj.s.values());

        if (preset) {
          expect(a[0].a).to.be.an.instanceOf(Error);
          expect(a[1]).to.be.an.instanceOf(Date);
        }

        expect(a[2]).to.be.a('string');
      });
    });
    describe('ArrayBuffer', function () {
      it('should return an ArrayBuffer', function () {
        var typeson = new Typeson().register(preset || [arraybuffer$1]);
        var buf = new ArrayBuffer(16);
        var tson = typeson.stringify(buf, null, 2);
        var back = typeson.parse(tson);
        expect(back instanceof ArrayBuffer);
        expect(back.byteLength).to.equal(16);
      });
      it('should return the same ArrayBuffer instance', function () {
        var typeson = new Typeson().register(preset || [arraybuffer$1]);
        var buf1 = new ArrayBuffer(16);
        var buf2 = buf1;
        var obj = {
          buf1: buf1,
          buf2: buf2
        };
        var tson = typeson.stringify(obj, null, 2);
        var back = typeson.parse(tson);
        expect(back.buf1 instanceof ArrayBuffer);
        expect(back.buf2 instanceof ArrayBuffer);
        expect(back.buf1).to.equal(back.buf2);
      });
    });
    describe('TypedArrays', function () {
      describe('Float64Array', function () {
        it('should get back real Float64Array instance with original array content', function () {
          var typeson = new Typeson().register(preset || [arraybuffer$1, typedArrays]);
          var a = new Float64Array(3);
          a[0] = 23.8;
          a[1] = -15;
          a[2] = 99;
          var json = typeson.stringify({
            a: a
          });
          var obj = typeson.parse(json);
          expect(obj.a).to.be.an.instanceOf(Float64Array);
          expect(obj.a.length).to.equal(3);
          expect(obj.a[0]).to.equal(23.8);
          expect(obj.a[1]).to.equal(-15);
          expect(obj.a[2]).to.equal(99);
        });
      });
      describe('Uint16 arrays over invalid unicode range', function () {
        it('should work to use any 16-bit number no matter whether it is invalid unicode or not', function () {
          var typeson = new Typeson().register(preset || [arraybuffer$1, typedArrays]);
          var a = new Uint16Array(0x0900);
          var i = a.length;

          while (i--) {
            a[i] = i + 0xd780;
          }

          var json = typeson.stringify({
            a: a
          }); // console.log(json);
          // Emulate a textencoder that eliminates invalid UTF chars

          i = json.length;
          var copy = new Uint16Array(i);

          while (i--) {
            var ch = json.charCodeAt(i);
            copy[i] = ch >= 0xd800 && ch < 0xe000 ? 0xfffd : ch;
          }

          json = String.fromCharCode.apply(null, copy);
          var obj = typeson.parse(json);
          expect(obj.a).to.be.an.instanceOf(Uint16Array);
          expect(obj.a.length).to.equal(a.length);
          obj.a.forEach(function (x, i) {
            expect(x).to.equal(i + 0xd780);
          });
        });
      });
      describe('Int8 arrays with odd length', function () {
        it('should be possible to use an odd length of an Int8Array', function () {
          var typeson = new Typeson().register(preset || [arraybuffer$1, typedArrays]);
          var a = new Int8Array(3);
          a[0] = 0;
          a[1] = 1;
          a[2] = 2;
          var json = typeson.stringify(a); // console.log(json);

          var a2 = typeson.parse(json);
          expect(a2.length).to.equal(3);
          expect(a2[0]).to.equal(0);
          expect(a2[1]).to.equal(1);
          expect(a2[2]).to.equal(2);
        });
      });
      describe('Uint8 arrays with shared buffer object', function () {
        it('should return the same buffer object from different wrappers (or data views or buffer itself)', function () {
          var typeson = new Typeson().register(preset || [arraybuffer$1, typedArrays, dataview$1]);
          var shared = new ArrayBuffer(7);
          var dataView = new DataView(shared, 3, 4);
          var obj = {
            wrapper1: new Uint8Array(shared),
            wrapper2: new Uint16Array(shared, 2, 2),
            buffer: shared,
            dataView: dataView
          };
          obj.wrapper1[0] = 1;
          obj.wrapper2[1] = 0xffff;
          var json = typeson.stringify(obj); // console.log(json);

          var obj2 = typeson.parse(json);
          expect(obj2.wrapper1.buffer).to.equal(obj2.wrapper2.buffer);
          expect(obj2.wrapper1.buffer).to.equal(obj2.buffer);
          expect(obj2.wrapper1.buffer).to.equal(obj2.dataView.buffer);
        });
      });
    });
    /*
    // TODO: Add for typed-arrays-socketio
    describe('TypedArrays Socket-IO', () => {
    });
    */

    describe('DataView', function () {
      it('should return a DataView', function () {
        var typeson = new Typeson().register(preset || [dataview$1]);
        var sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
        var buffer = new Uint8Array(sample).buffer;
        var dataView = new DataView(buffer, 3, 4);
        expect(dataView.byteLength).to.equal(4);
        var tson = typeson.stringify(dataView, null, 2);
        var back = typeson.parse(tson);
        expect(back).to.be.an.instanceOf(DataView);
        expect(back.byteLength).to.equal(4);
      });
      it('should reproduce DataView with the same buffer', function () {
        var typeson = new Typeson().register(preset || [dataview$1]);
        var sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
        var buffer = new Uint8Array(sample).buffer;
        var dataView1 = new DataView(buffer, 3, 4);
        var dataView2 = new DataView(buffer, 3, 4);
        var dataView3 = new DataView(buffer, 3, 4);
        var obj = {
          dataView1: dataView1,
          dataView2: dataView2,
          dataView3: dataView3
        };
        var tson = typeson.stringify(obj, null, 2);
        var back = typeson.parse(tson);
        expect(back.dataView1).to.be.an.instanceOf(DataView);
        expect(back.dataView2).to.be.an.instanceOf(DataView);
        expect(back.dataView3).to.be.an.instanceOf(DataView);
        expect(back.dataView1.byteLength).to.equal(4);
      });
    });
    describe('Intl types', function () {
      it('should return a Intl.Collator', function () {
        var typeson = new Typeson().register(preset || [intlTypes$1]); // After `-u-`, the values don't appear to be validated in Node or Chrome

        var locales = ['en', 'hi', 'de-AT', 'de-DE-u-co-phonebk', 'en-US-u-kn-true', 'en-US-u-kf-upper'];
        var opts = {
          localeMatcher: 'lookup',
          usage: 'search',
          sensitivity: 'base',
          ignorePunctuation: true,
          numeric: true,
          caseFirst: 'upper'
        };
        var optsClone = JSON.parse(JSON.stringify(opts));
        var collator = new Intl.Collator(locales, opts);
        var expectedLocale = collator.resolvedOptions().locale;
        var tson = typeson.stringify(collator, null, 2);
        var back = typeson.parse(tson);
        expect(back instanceof Intl.Collator); // console.log(Intl.Collator.supportedLocalesOf(Object.keys(optsClone.locales), optsClone.localeMatcher));

        expect(back.resolvedOptions().locale).to.deep.equal(expectedLocale);
        Object.keys(optsClone).filter(function (k) {
          return ![// These would ideally be present but are not available for inspection
          'localeMatcher', 'locales'].includes(k);
        }).forEach(function (prop) {
          expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
        });
      });
      it('should return a Intl.DateTimeFormat', function () {
        var typeson = new Typeson().register(preset || [intlTypes$1]);
        var locales = ['hi', 'de-AT', 'de-DE-u-nu-latn', 'en-US-u-ca-persian'];
        var opts = {
          localeMatcher: 'lookup',
          timeZone: 'Asia/Shanghai',
          hour12: false,
          formatMatcher: 'basic'
        };
        var optsClone = JSON.parse(JSON.stringify(opts));
        var dtf = new Intl.DateTimeFormat(locales, opts);
        var tson = typeson.stringify(dtf, null, 2);
        var back = typeson.parse(tson);
        expect(back instanceof Intl.DateTimeFormat);
        Object.keys(optsClone).filter(function (k) {
          return ![// These would ideally be present but are not available for inspection
          'localeMatcher', 'locales', 'formatMatcher', 'hour12' // Not currently working in Node or Chrome
          ].includes(k);
        }).forEach(function (prop) {
          expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
        });
      });
      it('should return a Intl.NumberFormat', function () {
        var typeson = new Typeson().register(preset || [intlTypes$1]);
        var locales = ['hi', 'de-AT', 'de-DE-u-nu-bali'];
        var opts = {
          localeMatcher: 'lookup',
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
          useGrouping: false
        };
        var optsClone = JSON.parse(JSON.stringify(opts));
        var dtf = new Intl.NumberFormat(locales, opts);
        var tson = typeson.stringify(dtf, null, 2);
        var back = typeson.parse(tson);
        expect(back instanceof Intl.NumberFormat);
        Object.keys(optsClone).filter(function (k) {
          return ![// These would ideally be present but are not available for inspection
          'localeMatcher', 'locales'].includes(k);
        }).forEach(function (prop) {
          expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
        });
      });
    });

    if (typeof BigInt !== 'undefined') {
      describe('BigInt', function () {
        it('bigint', function () {
          var typeson = new Typeson().register(preset || bigint$1);
          var tson = typeson.stringify(BigInt('9007199254740993'), null, 2);
          var back = typeson.parse(tson);
          expect(_typeof(back)).to.equal('bigint');
          expect(back).to.equal(BigInt('9007199254740993'));
        });
        it('bigintObject', function () {
          var typeson = new Typeson().register(preset || bigintObject$1);
          var tson = typeson.stringify(Object(BigInt('9007199254740993')), null, 2);
          var back = typeson.parse(tson);
          expect(_typeof(back)).to.equal('object');
          expect(back).to.deep.equal(Object(BigInt('9007199254740993')));
        });
      });
    }
  }

  describe('Built-in', BuiltIn);
  describe('ImageData', function () {
    it('should get back an ImageData instance with the original data', function () {
      var typeson = new Typeson().register(imagedata$1);
      var imageData = new ImageData(1, 3);
      var tson = typeson.stringify(imageData);
      var back = typeson.parse(tson);
      expect(back.width).to.equal(1);
      expect(back.height).to.equal(3);
      expect(back.data).to.deep.equal(new Uint8ClampedArray(12));
    });
  });
  describe('ImageBitmap', function () {
    it('should get back an ImageBitmap instance with the original data', function (done) {
      this.timeout(10000);
      var typeson = new Typeson().register(imagebitmap$1);
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = document.createElement('img'); // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        createImageBitmap(canvas).then(function (imageBitmap) {
          var tson = typeson.stringify(imageBitmap);
          return typeson.parse(tson);
        }).then(function (back) {
          expect(back.width).to.equal(300
          /* img.width */
          );
          expect(back.height).to.equal(150
          /* img.height */
          );
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          ctx.drawImage(back, 0, 0); // Not getting a URL that is displaying properly or exactly consistent between Node/browser

          try {
            // Node
            expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
          } catch (err) {
            try {
              // Chrome
              expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
            } catch (err) {
              // Firefox
              expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
            }
          }

          done();
        });
      }; // Didn't work with a relative path nor with an SVG file in node-canvas


      img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
    it('should get back an ImageBitmap instance with the original data asynchronously', function (done) {
      var typeson = new Typeson().register(imagebitmap$1);
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = document.createElement('img'); // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        createImageBitmap(canvas).then(function (imageBitmap) {
          var tson = typeson.stringify(imageBitmap);
          return typeson.parseAsync(tson);
        }).then(function (back) {
          expect(back.width).to.equal(300); // img.width

          expect(back.height).to.equal(150); // img.height

          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          ctx.drawImage(back, 0, 0); // Not getting a URL that is displaying properly or exactly consistent between Node/browser

          try {
            // Node
            expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
          } catch (err) {
            try {
              // Chrome
              expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
            } catch (err) {
              // Firefox
              expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
            }
          }

          done();
        });
      }; // Didn't work with a relative path nor with an SVG file in node-canvas


      img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
  });
  describe('Blob', function () {
    it('should get back a Blob instance with the original data', function (done) {
      this.timeout(10000);
      var typeson = new Typeson().register(blob$1);
      var contentType = 'application/json';
      var stringContents = JSON.stringify("abc\u1234");
      var blob1 = new Blob([// BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
      stringContents], {
        type: contentType // DOMString

      });
      var tson = typeson.stringify(blob1);
      var back = typeson.parse(tson);
      expect(back.type).to.equal(contentType);
      expect('name' in back).to.be.false; // No file properties

      expect('lastModified' in back).to.be.false; // No file properties

      var reader = new FileReader();
      reader.addEventListener('load', function () {
        expect(reader.result).to.equal(stringContents);
        done();
      });
      reader.addEventListener('error', function () {
        assert(false, 'FileReader should not err');
      });
      reader.readAsText(back);
    });
    it('should get back a Blob instance with the original data asynchronously', function (done) {
      var typeson = new Typeson().register(blob$1);
      var contentType = 'application/json';
      var stringContents = JSON.stringify("abc\u1234");
      var blob1 = new Blob([// BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
      stringContents], {
        type: contentType // DOMString

      });
      typeson.stringifyAsync(blob1).then(function (tson) {
        var back = typeson.parse(tson);
        expect(back.type).to.equal(contentType);
        expect('name' in back).to.be.false; // No file properties

        expect('lastModified' in back).to.be.false; // No file properties

        var reader = new FileReader();
        reader.addEventListener('load', function () {
          expect(reader.result).to.equal(stringContents);
          done();
        });
        reader.addEventListener('error', function () {
          assert(false, 'FileReader should not err');
        });
        reader.readAsText(back);
      });
    });
    it('Handle large (typed array) Blobs', function (done) {
      this.timeout(30000); // From https://github.com/web-platform-tests/wpt/blob/master/IndexedDB/support-promises.js#L291

      function largeValue(size, seed) {
        var buffer = new Uint8Array(size); // 32-bit xorshift - must be non-zero seed

        var state = 1000 + seed;

        for (var i = 0; i < size; ++i) {
          state ^= state << 13;
          state ^= state >> 17;
          state ^= state << 5;
          buffer[i] = state & 0xff;
        }

        return buffer;
      }

      var typeson = new Typeson().register(structuredCloningThrowing$1);
      var largeVal = 131072;
      var b5 = new Blob([largeValue(largeVal, 1)], {
        type: 'text/x-blink-1'
      });
      var t5 = typeson.stringify(b5);
      var tback = typeson.parse(t5);
      expect(tback.size, 'Sync large val').to.equal(largeVal);
      var reader = new FileReader();

      reader.onloadend = function () {
        var view = new Uint8Array(reader.result);
        expect(view.join(',')).to.equal(largeValue(largeVal, 1).join(','));
        var b6 = new Blob([largeValue(largeVal, 1)], {
          type: 'text/x-blink-1'
        });
        typeson.stringifyAsync(b6).then(function (t6) {
          var tback = typeson.parse(t6);
          expect(tback.size, 'Async large val').to.equal(largeVal);
          var reader = new FileReader();

          reader.onloadend = function () {
            var view = new Uint8Array(reader.result);
            expect(view.join(',')).to.equal(largeValue(largeVal, 1).join(','));
            done();
          };

          reader.readAsArrayBuffer(tback);
        });
      };

      reader.readAsArrayBuffer(tback);
    });
  });
  describe('File', function () {
    this.timeout(10000);
    it('should get back a File instance with the original data', function (done) {
      var typeson = new Typeson().register(file$1);
      var currTime = new Date();
      var contentType = 'application/json';
      var fileName = 'aName';
      var stringContents = JSON.stringify("abc\u1234");
      var file1 = new File([// BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
      stringContents], fileName, // USVString (strings without unpaired surrogates)
      {
        type: contentType,
        // DOMString
        lastModified: currTime // Or number

      });
      var tson = typeson.stringify(file1);
      var back = typeson.parse(tson);
      expect(back.lastModified).to.equal(currTime.getTime());
      expect(back.type).to.equal(contentType);
      expect(back.name).to.equal(fileName);
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        expect(reader.result).to.equal(stringContents);
        done();
      });
      reader.addEventListener('error', function () {
        assert(false, 'FileReader should not err');
      });
      reader.readAsText(back);
    });
    it('should get back a File instance with the original data asynchronously', function (done) {
      var typeson = new Typeson().register(file$1);
      var currTime = new Date();
      var contentType = 'application/json';
      var fileName = 'aName';
      var stringContents = JSON.stringify("abc\u1234");
      var file1 = new File([// BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
      stringContents], fileName, // USVString (strings without unpaired surrogates)
      {
        type: contentType,
        // DOMString
        lastModified: currTime // Or number

      });
      typeson.stringifyAsync(file1).then(function (tson) {
        var back = typeson.parse(tson);
        expect(back.lastModified).to.equal(currTime.getTime());
        expect(back.type).to.equal(contentType);
        expect(back.name).to.equal(fileName);
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          expect(reader.result).to.equal(stringContents);
          done();
        });
        reader.addEventListener('error', function () {
          assert(false, 'FileReader should not err');
        });
        reader.readAsText(back);
      });
    });
  });
  describe('FileList', function () {
    this.timeout(10000);
    it('should get back a FileList instance with the original data', function () {
      var currTime = new Date();
      var anotherTime = new Date('1985');
      var input = document.createElement('input');
      input.type = 'file';
      input.files = [// See the test-environment for our adapter to make this settable
      new File(['content1'], 'abc', {
        type: 'text/plain',
        // DOMString
        lastModified: currTime // Or number

      }), new File(['content2'], 'def', {
        type: 'text/html',
        // DOMString
        lastModified: anotherTime // Or number

      })];
      expect(input.files).to.be.an.instanceOf(FileList);
      var typeson = new Typeson().register(filelist$1);
      var tson = typeson.stringify(input.files);
      var back = typeson.parse(tson);
      expect(back.item(0)).to.be.an.instanceOf(File);
      expect(back.item(0).lastModified).to.equal(currTime.getTime());
      expect(back.item(0).type).to.equal('text/plain');
      expect(back.item(0).name).to.equal('abc');
      expect(back.item(1)).to.be.an.instanceOf(File);
      expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
      expect(back.item(1).type).to.equal('text/html');
      expect(back.item(1).name).to.equal('def');
    });
    it('should get back a FileList instance with the original data asynchronously', function () {
      var currTime = new Date();
      var anotherTime = new Date('1985');
      var input = document.createElement('input');
      input.type = 'file';
      input.files = [// See the test-environment for our adapter to make this settable
      new File(['content1'], 'abc', {
        type: 'text/plain',
        // DOMString
        lastModified: currTime // Or number

      }), new File(['content2'], 'def', {
        type: 'text/html',
        // DOMString
        lastModified: anotherTime // Or number

      })];
      expect(input.files).to.be.an.instanceOf(FileList);
      var typeson = new Typeson().register(filelist$1);
      typeson.stringifyAsync(input.files).then(function (tson) {
        var back = typeson.parse(tson);
        expect(back.item(0)).to.be.an.instanceOf(File);
        expect(back.item(0).lastModified).to.equal(currTime.getTime());
        expect(back.item(0).type).to.equal('text/plain');
        expect(back.item(0).name).to.equal('abc');
        expect(back.item(1)).to.be.an.instanceOf(File);
        expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
        expect(back.item(1).type).to.equal('text/html');
        expect(back.item(1).name).to.equal('def');
      });
    });
  });
  describe('Non-built-in object ignoring', function () {
    it('should ignore non-built-in objects (simulated)', function () {
      var typeson = new Typeson().register(nonbuiltinIgnore$1);
      var john = new util.Person('John Doe');
      var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
      var tson = typeson.stringify({
        a: john,
        b: simulatedNonBuiltInObject
      });
      var back = typeson.parse(tson);
      expect(back).to.deep.equal({
        a: {
          name: 'John Doe'
        }
      });
      var a = typeson.encapsulate(['a', simulatedNonBuiltInObject, 5, null]);
      expect('0' in a).to.be.true;
      expect('1' in a).to.be.false;
      expect('2' in a).to.be.true;
      expect('3' in a).to.be.true;
    });
  });
  describe('User objects', function () {
    it('should do recursive type checking on user instantiated objects', function () {
      var typeson = new Typeson().register([userObject$1, date$1]);
      var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
      var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
      simulatedNonBuiltInObject.prop = 500;
      var tson = typeson.stringify({
        a: bob,
        b: simulatedNonBuiltInObject
      });
      var back = typeson.parse(tson);
      expect(back).to.deep.equal({
        a: {
          name: 'Bob Smith',
          age: 30,
          dob: new Date(2000, 5, 20),
          isMarried: true
        },
        b: {
          aaa: 5,
          prop: 500
        }
      });
      expect('dob' in back.a).to.be.true;
    });
    it('should work with nonbuiltin-ignore', function () {
      var typeson = new Typeson().register([userObject$1, nonbuiltinIgnore$1]);
      var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
      bob.nonbuiltin = new util.SimulatedNonBuiltIn();
      var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
      var tson = typeson.stringify({
        a: bob,
        b: simulatedNonBuiltInObject
      });
      var back = typeson.parse(tson);
      expect(back).to.deep.equal({
        a: {
          name: 'Bob Smith',
          age: 30,
          isMarried: true,
          dob: new Date(2000, 5, 20).toJSON()
        }
      });
      expect('nonbuiltin' in back.a).to.be.false;
    });
  });
  describe('Cloneables', function () {
    it('Should work with custom cloneable objects', function () {
      var typeson = new Typeson().register(cloneable$1);
      var objArg = {
        a: 1,
        b: 2
      };
      var mc = new util.MyCloneable(objArg);
      var originalNonpersistentStateInfo = mc.nonpersistentStateInfo;
      var encapsulated = typeson.encapsulate(mc);
      expect(mc[Symbol.for('cloneEncapsulate')]()).to.deep.equal({
        obj: JSON.stringify(objArg)
      });
      expect('nonpersistentStateInfo' in encapsulated).to.be.false;
      expect('prototypeProperty' in encapsulated).to.be.false;
      var tson = JSON.stringify(encapsulated);
      var back = typeson.parse(tson);
      expect(back).to.be.an.instanceOf(util.MyCloneable);
      expect(back).to.not.equal(mc);
      expect(back.obj).to.deep.equal(objArg);
      expect(back.hasOwnProperty('nonpersistentStateInfo')).to.be.true;
      expect(back.nonpersistentStateInfo).to.not.equal(originalNonpersistentStateInfo);
      expect('prototypeProperty' in back).to.be.true;
      expect(back.hasOwnProperty('prototypeProperty')).to.be.false;
    });
  });
  describe('Resurrectables', function () {
    it('Should work with custom resurrectable objects', function () {
      var typeson = new Typeson().register(resurrectable$1);
      var mr = new util.MyResurrectable();

      var mr2 = function resurrectableFunction() {};

      var mr3 = Symbol('resurrectable');
      var mr4 = {};
      var mr5 = [3, 4, 5];
      var encapsulated = typeson.encapsulate([mr, mr2, mr3, mr4, mr5]);
      var tson = JSON.stringify(encapsulated);
      var back = typeson.parse(tson);
      expect(back[0]).to.equal(mr);
      expect(back[1]).to.equal(mr2);
      expect(back[2]).to.equal(mr3);
      expect(back[3]).to.not.equal(mr4);
      expect(back[4]).to.not.equal(mr5);
    });
  });
  describe('Presets', function () {
    describe('Built-in (as preset)', function () {
      BuiltIn([builtin]);
    }); // TODO: Could add a shimmed postMessage test though covered by worker test

    describe('postMessage', function () {
      ErrorAndErrors([postMessage$1]);
    });
    describe('Universal', function () {
      BuiltIn([universal$1]);
    });
    describe('Structured cloning', function () {
      it('should work with Structured cloning with throwing', function () {
        var typeson = new Typeson().register([structuredCloningThrowing$1]);
        var caught = false;

        try {
          typeson.stringify(new Error('test'));
        } catch (err) {
          caught = true;
        }

        assert(caught, 'Caught error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
      });
      it('should work with Structured cloning without throwing', function () {
        var typeson = new Typeson().register([structuredCloning]);
        var caught = false;

        try {
          typeson.stringify(new Error('test'));
        } catch (err) {
          console.log(err);
          caught = true;
        }

        assert(!caught, 'Did not catch error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
      });
      it('should allow recursive type checking on user instantiated objects', function () {
        var typeson = new Typeson().register([structuredCloning]);
        var john = new util.Person('John Doe');
        var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
        var clonedData = typeson.parse(typeson.stringify([john, bob]));
        expect(clonedData).to.have.same.deep.members([{
          name: 'John Doe'
        }, {
          name: 'Bob Smith',
          dob: new Date(2000, 5, 20),
          age: 30,
          isMarried: true
        }]);
      });
      it('should work with recursive structures', function () {
        var typeson = new Typeson().register(structuredCloningThrowing$1);
        var obj = [];
        obj.push(obj);
        var clonedData = typeson.parse(typeson.stringify(obj));
        expect(clonedData[0]).to.equal(clonedData);
      });
    });
    describe('Special Numbers (as preset)', function () {
      SpecialNumbers([specialNumbers$1]);
    }); // TODO: Add test for socketio

    describe('Undefined (as preset)', function () {
      Undefined$1([undefPreset]);
    });
    describe('Sparse undefined', function () {
      it('should be possible to restore `undefined` properties', function () {
        var typeson = new Typeson().register([sparseUndefined$1]);
        var a = [undefined, {
          b: undefined,
          c: [3, null,, undefined]
        }]; // eslint-disable-line no-sparse-arrays

        var json = typeson.stringify(a);
        var a2 = typeson.parse(json);
        expect(a2.length).to.equal(2);
        expect(a2[0]).to.equal(null);
        expect('b' in a2[1]).to.be.false;
        expect(a2[1].c[0]).to.equal(3);
        expect(a2[1].c[1]).to.equal(null);
        expect(a2[1].c[2]).to.equal(undefined);
        expect('2' in a2[1].c).to.be.false;
        expect(a2[1].c[3]).to.equal(null);
      });
    });
  });
  mocha.run();

})));
//# sourceMappingURL=test-polyglot.js.map
