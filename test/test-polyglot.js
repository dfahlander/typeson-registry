(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var keys = Object.keys;
var isArray = Array.isArray;
var toString = {}.toString;
var getProto = Object.getPrototypeOf;
var hasOwn = {}.hasOwnProperty;
var fnToString = hasOwn.toString;

function isThenable(v, catchCheck) {
    return Typeson$1.isObject(v) && typeof v.then === 'function' && (!catchCheck || typeof v.catch === 'function');
}

function toStringTag(val) {
    return toString.call(val).slice(8, -1);
}

function hasConstructorOf(a, b) {
    if (!a || (typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object') {
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

function isObject(v) {
    return v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object';
}

/* Typeson - JSON with types
    * License: The MIT License (MIT)
    * Copyright (c) 2016 David Fahlander
    */

/** An instance of this class can be used to call stringify() and parse().
 * Typeson resolves cyclic references by default. Can also be extended to
 * support custom types using the register() method.
 *
 * @constructor
 * @param {{cyclic: boolean}} [options] - if cyclic (default true), cyclic references will be handled gracefully.
 */
function Typeson$1(options) {
    // Replacers signature: replace (value). Returns falsy if not replacing. Otherwise ['Date', value.getTime()]
    var plainObjectReplacers = [];
    var nonplainObjectReplacers = [];
    // Revivers: map {type => reviver}. Sample: {'Date': value => new Date(value)}
    var revivers = {};

    /** Types registered via register() */
    var regTypes = this.types = {};

    /** Serialize given object to Typeson.
     *
     * Arguments works identical to those of JSON.stringify().
     */
    var stringify = this.stringify = function (obj, replacer, space, opts) {
        // replacer here has nothing to do with our replacers.
        opts = Object.assign({}, options, opts, { stringification: true });
        var encapsulated = encapsulate(obj, null, opts);
        if (isArray(encapsulated)) {
            return JSON.stringify(encapsulated[0], replacer, space);
        }
        return encapsulated.then(function (res) {
            return JSON.stringify(res, replacer, space);
        });
    };

    // Also sync but throws on non-sync result
    this.stringifySync = function (obj, replacer, space, opts) {
        return stringify(obj, replacer, space, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: true }));
    };
    this.stringifyAsync = function (obj, replacer, space, opts) {
        return stringify(obj, replacer, space, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: false }));
    };

    /** Parse Typeson back into an obejct.
     *
     * Arguments works identical to those of JSON.parse().
     */
    var parse = this.parse = function (text, reviver, opts) {
        opts = Object.assign({}, options, opts, { parse: true });
        return revive(JSON.parse(text, reviver), opts); // This reviver has nothing to do with our revivers.
    };

    // Also sync but throws on non-sync result
    this.parseSync = function (text, reviver, opts) {
        return parse(text, reviver, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: true })); // This reviver has nothing to do with our revivers.
    };
    this.parseAsync = function (text, reviver, opts) {
        return parse(text, reviver, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: false })); // This reviver has nothing to do with our revivers.
    };

    this.specialTypeNames = function (obj, stateObj) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        opts.returnTypeNames = true;
        return this.encapsulate(obj, stateObj, opts);
    };
    this.rootTypeName = function (obj, stateObj) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        opts.iterateNone = true;
        return this.encapsulate(obj, stateObj, opts);
    };

    /** Encapsulate a complex object into a plain Object by replacing registered types with
     * plain objects representing the types data.
     *
     * This method is used internally by Typeson.stringify().
     * @param {Object} obj - Object to encapsulate.
     */
    var encapsulate = this.encapsulate = function (obj, stateObj, opts) {
        opts = Object.assign({ sync: true }, options, opts);
        var sync = opts.sync;
        var types = {},
            refObjs = [],
            // For checking cyclic references
        refKeys = [],
            // For checking cyclic references
        promisesDataRoot = [];
        // Clone the object deeply while at the same time replacing any special types or cyclic reference:
        var cyclic = opts && 'cyclic' in opts ? opts.cyclic : true;
        var encapsulateObserver = opts.encapsulateObserver;
        var ret = _encapsulate('', obj, cyclic, stateObj || {}, promisesDataRoot);
        function finish(ret) {
            // Add $types to result only if we ever bumped into a special type (or special case where object has own `$types`)
            if (opts.iterateNone) {
                var _typeNames = Object.values(types);
                if (_typeNames.length) {
                    return _typeNames[0];
                }
                return Typeson$1.getJSONType(ret);
            }
            var typeNames = Object.values(types);
            if (typeNames.length) {
                if (opts.returnTypeNames) {
                    return [].concat(toConsumableArray(new Set(typeNames)));
                }
                if (!ret || !isPlainObject(ret) || // Special if array (or a primitive) was serialized because JSON would ignore custom `$types` prop on it
                ret.hasOwnProperty('$types') // Also need to handle if this is an object with its own `$types` property (to avoid ambiguity)
                ) {
                        ret = { $: ret, $types: { $: types } };
                    } else {
                    ret.$types = types;
                }
            } else if (isObject(ret) && ret.hasOwnProperty('$types')) {
                // No special types
                ret = { $: ret, $types: true };
            }
            if (opts.returnTypeNames) {
                return false;
            }
            return ret;
        }
        function checkPromises(ret, promisesData) {
            return Promise.all(promisesData.map(function (pd) {
                return pd[1].p;
            })).then(function (promResults) {
                return Promise.all(promResults.map(function (promResult) {
                    var newPromisesData = [];
                    var prData = promisesData.splice(0, 1)[0];

                    var _prData = slicedToArray(prData, 7),
                        keyPath = _prData[0],
                        cyclic = _prData[2],
                        stateObj = _prData[3],
                        parentObj = _prData[4],
                        key = _prData[5],
                        detectedType = _prData[6];

                    var encaps = _encapsulate(keyPath, promResult, cyclic, stateObj, newPromisesData, true, detectedType);
                    var isTypesonPromise = hasConstructorOf(encaps, TypesonPromise);
                    if (keyPath && isTypesonPromise) {
                        // Handle case where an embedded custom type itself returns a `Typeson.Promise`
                        return encaps.p.then(function (encaps2) {
                            parentObj[key] = encaps2;
                            return checkPromises(ret, newPromisesData);
                        });
                    }
                    if (keyPath) parentObj[key] = encaps;else if (isTypesonPromise) {
                        ret = encaps.p;
                    } else ret = encaps; // If this is itself a `Typeson.Promise` (because the original value supplied was a promise or because the supplied custom type value resolved to one), returning it below will be fine since a promise is expected anyways given current config (and if not a promise, it will be ready as the resolve value)
                    return checkPromises(ret, newPromisesData);
                }));
            }).then(function () {
                return ret;
            });
        }
        return promisesDataRoot.length ? sync && opts.throwOnBadSyncType ? function () {
            throw new TypeError('Sync method requested but async result obtained');
        }() : Promise.resolve(checkPromises(ret, promisesDataRoot)).then(finish) : !sync && opts.throwOnBadSyncType ? function () {
            throw new TypeError('Async method requested but sync result obtained');
        }() : opts.stringification && sync // If this is a synchronous request for stringification, yet a promise is the result, we don't want to resolve leading to an async result, so we return an array to avoid ambiguity
        ? [finish(ret)] : sync ? finish(ret) : Promise.resolve(finish(ret));

        function _encapsulate(keypath, value, cyclic, stateObj, promisesData, resolvingTypesonPromise, detectedType) {
            var ret = void 0;
            var observerData = {};
            var $typeof = typeof value === 'undefined' ? 'undefined' : _typeof(value);
            var runObserver = encapsulateObserver ? function (obj) {
                var type = detectedType || stateObj.type || Typeson$1.getJSONType(value);
                encapsulateObserver(Object.assign(obj || observerData, {
                    keypath: keypath,
                    value: value,
                    cyclic: cyclic,
                    stateObj: stateObj,
                    promisesData: promisesData,
                    resolvingTypesonPromise: resolvingTypesonPromise,
                    awaitingTypesonPromise: hasConstructorOf(value, TypesonPromise)
                }, type !== undefined ? { type: type } : {}));
            } : null;
            if ($typeof in { string: 1, boolean: 1, number: 1, undefined: 1 }) {
                if (value === undefined || $typeof === 'number' && (isNaN(value) || value === -Infinity || value === Infinity)) {
                    ret = replace(keypath, value, stateObj, promisesData, false, resolvingTypesonPromise, runObserver);
                    if (ret !== value) {
                        observerData = { replaced: ret };
                    }
                } else {
                    ret = value;
                }
                if (runObserver) runObserver();
                return ret;
            }
            if (value === null) {
                if (runObserver) runObserver();
                return value;
            }
            if (cyclic && !stateObj.iterateIn && !stateObj.iterateUnsetNumeric) {
                // Options set to detect cyclic references and be able to rewrite them.
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
            var replaced = (isPlainObj || isArr) && (!plainObjectReplacers.length || stateObj.replaced) || stateObj.iterateIn // Running replace will cause infinite loop as will test positive again
            ?
            // Optimization: if plain object and no plain-object replacers, don't try finding a replacer
            value : replace(keypath, value, stateObj, promisesData, isPlainObj || isArr, null, runObserver);
            var clone = void 0;
            if (replaced !== value) {
                ret = replaced;
                observerData = { replaced: replaced };
            } else {
                if (isArr || stateObj.iterateIn === 'array') {
                    clone = new Array(value.length);
                    observerData = { clone: clone };
                } else if (isPlainObj || stateObj.iterateIn === 'object') {
                    clone = {};
                    observerData = { clone: clone };
                } else if (keypath === '' && hasConstructorOf(value, TypesonPromise)) {
                    promisesData.push([keypath, value, cyclic, stateObj, undefined, undefined, stateObj.type]);
                    ret = value;
                } else {
                    ret = value; // Only clone vanilla objects and arrays
                }
            }
            if (runObserver) runObserver();

            if (opts.iterateNone) {
                return clone || ret;
            }

            if (!clone) {
                return ret;
            }

            // Iterate object or array
            if (stateObj.iterateIn) {
                for (var key in value) {
                    var ownKeysObj = { ownKeys: value.hasOwnProperty(key) };
                    var kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);
                    var val = _encapsulate(kp, value[key], !!cyclic, ownKeysObj, promisesData, resolvingTypesonPromise);
                    if (hasConstructorOf(val, TypesonPromise)) {
                        promisesData.push([kp, val, !!cyclic, ownKeysObj, clone, key, ownKeysObj.type]);
                    } else if (val !== undefined) clone[key] = val;
                }
                if (runObserver) runObserver({ endIterateIn: true, end: true });
            } else {
                // Note: Non-indexes on arrays won't survive stringify so somewhat wasteful for arrays, but so too is iterating all numeric indexes on sparse arrays when not wanted or filtering own keys for positive integers
                keys(value).forEach(function (key) {
                    var kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);
                    var ownKeysObj = { ownKeys: true };
                    var val = _encapsulate(kp, value[key], !!cyclic, ownKeysObj, promisesData, resolvingTypesonPromise);
                    if (hasConstructorOf(val, TypesonPromise)) {
                        promisesData.push([kp, val, !!cyclic, ownKeysObj, clone, key, ownKeysObj.type]);
                    } else if (val !== undefined) clone[key] = val;
                });
                if (runObserver) runObserver({ endIterateOwn: true, end: true });
            }
            // Iterate array for non-own numeric properties (we can't replace the prior loop though as it iterates non-integer keys)
            if (stateObj.iterateUnsetNumeric) {
                var vl = value.length;
                for (var i = 0; i < vl; i++) {
                    if (!(i in value)) {
                        var _kp = keypath + (keypath ? '.' : '') + i; // No need to escape numeric
                        var _ownKeysObj = { ownKeys: false };
                        var _val = _encapsulate(_kp, undefined, !!cyclic, _ownKeysObj, promisesData, resolvingTypesonPromise);
                        if (hasConstructorOf(_val, TypesonPromise)) {
                            promisesData.push([_kp, _val, !!cyclic, _ownKeysObj, clone, i, _ownKeysObj.type]);
                        } else if (_val !== undefined) clone[i] = _val;
                    }
                }
                if (runObserver) runObserver({ endIterateUnsetNumeric: true, end: true });
            }
            return clone;
        }

        function replace(keypath, value, stateObj, promisesData, plainObject, resolvingTypesonPromise, runObserver) {
            // Encapsulate registered types
            var replacers = plainObject ? plainObjectReplacers : nonplainObjectReplacers;
            var i = replacers.length;
            while (i--) {
                var replacer = replacers[i];
                if (replacer.test(value, stateObj)) {
                    var type = replacer.type;
                    if (revivers[type]) {
                        // Record the type only if a corresponding reviver exists.
                        // This is to support specs where only replacement is done.
                        // For example ensuring deep cloning of the object, or
                        // replacing a type to its equivalent without the need to revive it.
                        var existing = types[keypath];
                        // type can comprise an array of types (see test shouldSupportIntermediateTypes)
                        types[keypath] = existing ? [type].concat(existing) : type;
                    }
                    // Now, also traverse the result in case it contains its own types to replace
                    stateObj = Object.assign(stateObj, { type: type, replaced: true });
                    if ((sync || !replacer.replaceAsync) && !replacer.replace) {
                        if (runObserver) runObserver({ typeDetected: true });
                        return _encapsulate(keypath, value, cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
                    }
                    if (runObserver) runObserver({ replacing: true });

                    var replaceMethod = sync || !replacer.replaceAsync ? 'replace' : 'replaceAsync';
                    return _encapsulate(keypath, replacer[replaceMethod](value, stateObj), cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
                }
            }
            return value;
        }
    };

    // Also sync but throws on non-sync result
    this.encapsulateSync = function (obj, stateObj, opts) {
        return encapsulate(obj, stateObj, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: true }));
    };
    this.encapsulateAsync = function (obj, stateObj, opts) {
        return encapsulate(obj, stateObj, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: false }));
    };

    /** Revive an encapsulated object.
     * This method is used internally by Typeson.parse().
     * @param {Object} obj - Object to revive. If it has $types member, the properties that are listed there
     * will be replaced with its true type instead of just plain objects.
     */
    var revive = this.revive = function (obj, opts) {
        opts = Object.assign({ sync: true }, options, opts);
        var sync = opts.sync;
        var types = obj && obj.$types,
            ignore$Types = true;
        if (!types) return obj; // No type info added. Revival not needed.
        if (types === true) return obj.$; // Object happened to have own `$types` property but with no actual types, so we unescape and return that object
        if (types.$ && isPlainObject(types.$)) {
            // Special when root object is not a trivial Object, it will be encapsulated in $. It will also be encapsulated in $ if it has its own `$` property to avoid ambiguity
            obj = obj.$;
            types = types.$;
            ignore$Types = false;
        }
        var keyPathResolutions = [];
        var ret = _revive('', obj, null, opts);
        ret = hasConstructorOf(ret, Undefined$1) ? undefined : ret;
        return isThenable(ret) ? sync && opts.throwOnBadSyncType ? function () {
            throw new TypeError('Sync method requested but async result obtained');
        }() : ret : !sync && opts.throwOnBadSyncType ? function () {
            throw new TypeError('Async method requested but sync result obtained');
        }() : sync ? ret : Promise.resolve(ret);

        function _revive(keypath, value, target, opts, clone, key) {
            if (ignore$Types && keypath === '$types') return;
            var type = types[keypath];
            if (isArray(value) || isPlainObject(value)) {
                var _clone = isArray(value) ? new Array(value.length) : {};
                // Iterate object or array
                keys(value).forEach(function (key) {
                    var val = _revive(keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key), value[key], target || _clone, opts, _clone, key);
                    if (hasConstructorOf(val, Undefined$1)) _clone[key] = undefined;else if (val !== undefined) _clone[key] = val;
                });
                value = _clone;
                while (keyPathResolutions.length) {
                    // Try to resolve cyclic reference as soon as available
                    var _keyPathResolutions$ = slicedToArray(keyPathResolutions[0], 4),
                        _target = _keyPathResolutions$[0],
                        keyPath = _keyPathResolutions$[1],
                        _clone2 = _keyPathResolutions$[2],
                        _key = _keyPathResolutions$[3];

                    var val = getByKeyPath(_target, keyPath);
                    if (hasConstructorOf(val, Undefined$1)) _clone2[_key] = undefined;else if (val !== undefined) _clone2[_key] = val;else break;
                    keyPathResolutions.splice(0, 1);
                }
            }
            if (!type) return value;
            if (type === '#') {
                var _ret = getByKeyPath(target, value.substr(1));
                if (_ret === undefined) {
                    // Cyclic reference not yet available
                    keyPathResolutions.push([target, value.substr(1), clone, key]);
                }
                return _ret;
            }
            var sync = opts.sync;
            return [].concat(type).reduce(function (val, type) {
                var reviver = revivers[type];
                if (!reviver) throw new Error('Unregistered type: ' + type);
                return reviver[// eslint-disable-line standard/computed-property-even-spacing
                sync && reviver.revive ? 'revive' : !sync && reviver.reviveAsync ? 'reviveAsync' : 'revive'](val);
            }, value);
        }
    };

    // Also sync but throws on non-sync result
    this.reviveSync = function (obj, opts) {
        return revive(obj, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: true }));
    };
    this.reviveAsync = function (obj, opts) {
        return revive(obj, Object.assign({}, { throwOnBadSyncType: true }, opts, { sync: false }));
    };

    /** Register types.
     * For examples how to use this method, see https://github.com/dfahlander/typeson-registry/tree/master/types
     * @param {Array.<Object.<string,Function[]>>} typeSpec - Types and their functions [test, encapsulate, revive];
     */
    this.register = function (typeSpecSets, opts) {
        opts = opts || {};
        [].concat(typeSpecSets).forEach(function R(typeSpec) {
            if (isArray(typeSpec)) return typeSpec.map(R); // Allow arrays of arrays of arrays...
            typeSpec && keys(typeSpec).forEach(function (typeId) {
                if (typeId === '#') {
                    throw new TypeError('# cannot be used as a type name as it is reserved for cyclic objects');
                } else if (Typeson$1.JSON_TYPES.includes(typeId)) {
                    throw new TypeError('Plain JSON object types are reserved as type names');
                }
                var spec = typeSpec[typeId];
                var replacers = spec.testPlainObjects ? plainObjectReplacers : nonplainObjectReplacers;
                var existingReplacer = replacers.filter(function (r) {
                    return r.type === typeId;
                });
                if (existingReplacer.length) {
                    // Remove existing spec and replace with this one.
                    replacers.splice(replacers.indexOf(existingReplacer[0]), 1);
                    delete revivers[typeId];
                    delete regTypes[typeId];
                }
                if (spec) {
                    if (typeof spec === 'function') {
                        // Support registering just a class without replacer/reviver
                        var Class = spec;
                        spec = {
                            test: function test(x) {
                                return x && x.constructor === Class;
                            },
                            replace: function replace(x) {
                                return assign({}, x);
                            },
                            revive: function revive(x) {
                                return assign(Object.create(Class.prototype), x);
                            }
                        };
                    } else if (isArray(spec)) {
                        spec = {
                            test: spec[0],
                            replace: spec[1],
                            revive: spec[2]
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
                        plainObjectReplacers.splice(start, 0, replacerObj);
                    } else {
                        nonplainObjectReplacers.splice(start, 0, replacerObj);
                    }
                    // Todo: We might consider a testAsync type
                    if (spec.revive || spec.reviveAsync) {
                        var reviverObj = {};
                        if (spec.revive) reviverObj.revive = spec.revive.bind(spec);
                        if (spec.reviveAsync) reviverObj.reviveAsync = spec.reviveAsync.bind(spec);
                        revivers[typeId] = reviverObj;
                    }

                    regTypes[typeId] = spec; // Record to be retrieved via public types property.
                }
            });
        });
        return this;
    };
}

function assign(t, s) {
    keys(s).map(function (k) {
        t[k] = s[k];
    });
    return t;
}

/** escapeKeyPathComponent() utility */
function escapeKeyPathComponent(keyPathComponent) {
    return keyPathComponent.replace(/~/g, '~0').replace(/\./g, '~1');
}

/** unescapeKeyPathComponent() utility */
function unescapeKeyPathComponent(keyPathComponent) {
    return keyPathComponent.replace(/~1/g, '.').replace(/~0/g, '~');
}

/** getByKeyPath() utility */
function getByKeyPath(obj, keyPath) {
    if (keyPath === '') return obj;
    var period = keyPath.indexOf('.');
    if (period > -1) {
        var innerObj = obj[unescapeKeyPathComponent(keyPath.substr(0, period))];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return obj[unescapeKeyPathComponent(keyPath)];
}

function Undefined$1() {}

// With ES6 classes, we may be able to simply use `class TypesonPromise extends Promise` and add a string tag for detection
function TypesonPromise(f) {
    this.p = new Promise(f);
}
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
TypesonPromise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
};
TypesonPromise.resolve = function (v) {
    return new TypesonPromise(function (typesonResolve) {
        typesonResolve(v);
    });
};
TypesonPromise.reject = function (v) {
    return new TypesonPromise(function (typesonResolve, typesonReject) {
        typesonReject(v);
    });
};
['all', 'race'].map(function (meth) {
    TypesonPromise[meth] = function (promArr) {
        return new TypesonPromise(function (typesonResolve, typesonReject) {
            Promise[meth](promArr.map(function (prom) {
                return prom.p;
            })).then(typesonResolve, typesonReject);
        });
    };
});

// The following provide classes meant to avoid clashes with other values
Typeson$1.Undefined = Undefined$1; // To insist `undefined` should be added
Typeson$1.Promise = TypesonPromise; // To support async encapsulation/stringification

// Some fundamental type-checking utilities
Typeson$1.isThenable = isThenable;
Typeson$1.toStringTag = toStringTag;
Typeson$1.hasConstructorOf = hasConstructorOf;
Typeson$1.isObject = isObject;
Typeson$1.isPlainObject = isPlainObject;
Typeson$1.isUserObject = isUserObject;

Typeson$1.escapeKeyPathComponent = escapeKeyPathComponent;
Typeson$1.unescapeKeyPathComponent = unescapeKeyPathComponent;
Typeson$1.getByKeyPath = getByKeyPath;
Typeson$1.getJSONType = function (value) {
    return value === null ? 'null' : isArray(value) ? 'array' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
};
Typeson$1.JSON_TYPES = ['null', 'boolean', 'number', 'string', 'array', 'object'];

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

var encode = function encode(arraybuffer, byteOffset, length) {
    var bytes = new Uint8Array(arraybuffer, byteOffset, length),
        len = bytes.length;
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
    var encoded1 = void 0,
        encoded2 = void 0,
        encoded3 = void 0,
        encoded4 = void 0;

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

var arraybuffer$1 = {
    arraybuffer: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'ArrayBuffer';
        },
        replace: function replace(b) {
            return encode(b);
        },
        revive: function revive(b64) {
            return decode(b64);
        }
    }
};

// See also typed-arrays!

var blob$1 = {
    blob: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'Blob';
        },
        replace: function replace(b) {
            // Sync
            var req = new XMLHttpRequest();
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

            return new Blob([stringContents], { type: type });
        },
        replaceAsync: function replaceAsync(b) {
            return new Typeson$1.Promise(function (resolve, reject) {
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
                reader.readAsText(b);
            });
        }
    }
};

var cloneableObjectsByUUID = {};

// TODO: We could use `import generateUUID from 'uuid/v4';` (but it needs crypto library, etc.)
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

var cloneable$1 = {
    cloneable: {
        test: function test(x) {
            return x && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof x[Symbol.for('cloneEncapsulate')] === 'function';
        },
        replace: function replace(cloneable) {
            var encapsulated = cloneable[Symbol.for('cloneEncapsulate')]();
            var uuid = generateUUID();
            cloneableObjectsByUUID[uuid] = cloneable;
            return { uuid: uuid, encapsulated: encapsulated };
        },
        revive: function revive(_ref) {
            var uuid = _ref.uuid,
                encapsulated = _ref.encapsulated;

            return cloneableObjectsByUUID[uuid][Symbol.for('cloneRevive')](encapsulated);
        }
    }
};

var dataview$1 = {
    dataview: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'DataView';
        },
        replace: function replace(_ref) {
            var buffer = _ref.buffer,
                byteOffset = _ref.byteOffset,
                byteLength = _ref.byteLength;

            return {
                buffer: encode(buffer),
                byteOffset: byteOffset,
                byteLength: byteLength
            };
        },
        revive: function revive(_ref2) {
            var buffer = _ref2.buffer,
                byteOffset = _ref2.byteOffset,
                byteLength = _ref2.byteLength;

            return new DataView(decode(buffer), byteOffset, byteLength);
        }
    }
};

var date$1 = {
    date: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'Date';
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

var error$1 = {
    error: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'Error';
        },
        replace: function replace(_ref) {
            var name = _ref.name,
                message = _ref.message;

            return { name: name, message: message };
        },
        revive: function revive(_ref2) {
            var name = _ref2.name,
                message = _ref2.message;

            var e = new Error(message);
            e.name = name;
            return e;
        }
    }
};
// See also errors.js that may be registered after having registered this type.

/* eslint-env browser, node */
var _global = typeof self === 'undefined' ? global : self;

var exportObj = {};
// Comprises all built-in errors.
['TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'EvalError', 'URIError', 'InternalError' // non-standard
].forEach(function (errName) {
    var constructor = _global[errName];
    if (constructor) {
        exportObj[errName.toLowerCase()] = {
            test: function test(x) {
                return Typeson$1.hasConstructorOf(x, constructor);
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

var file$1 = {
    file: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'File';
        },
        replace: function replace(f) {
            // Sync
            var req = new XMLHttpRequest();
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

            return new File([stringContents], name, {
                type: type,
                lastModified: lastModified
            });
        },
        replaceAsync: function replaceAsync(f) {
            return new Typeson$1.Promise(function (resolve, reject) {
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
                reader.readAsText(f);
            });
        }
    }
};

var filelist$1 = {
    file: file$1.file,
    filelist: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'FileList';
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
var imagebitmap$1 = {
    imagebitmap: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'ImageBitmap' ||
            // In Node, our polyfill sets the dataset on a canvas element as JSDom no longer allows overriding toStringTag
            x && x.dataset && x.dataset.toStringTag === 'ImageBitmap';
        },
        replace: function replace(bm) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(bm, 0, 0);
            // Although `width` and `height` are part of `ImageBitMap`, these will
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
            var img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            img.src = o;
            return canvas; // Works in contexts allowing an ImageBitmap (We might use `OffscreenCanvas.transferToBitmap` when supported)
        },
        reviveAsync: function reviveAsync(o) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
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
var imagedata$1 = {
    imagedata: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'ImageData';
        },
        replace: function replace(d) {
            return {
                array: Array.from(d.data), // Ensure `length` gets preserved for revival
                width: d.width,
                height: d.height
            };
        },
        revive: function revive(o) {
            return new ImageData(new Uint8ClampedArray(o.array), o.width, o.height);
        }
    }
};

var infinity$1 = {
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
        return Typeson$1.hasConstructorOf(x, Intl.Collator);
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
        return Typeson$1.hasConstructorOf(x, Intl.DateTimeFormat);
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
        return Typeson$1.hasConstructorOf(x, Intl.NumberFormat);
    },
    replace: function replace(nf) {
        return nf.resolvedOptions();
    },
    revive: function revive(options) {
        return new Intl.NumberFormat(options.locale, options);
    }
};

var intlTypes$1 = {
    IntlCollator: IntlCollator,
    IntlDateTimeFormat: IntlDateTimeFormat,
    IntlNumberFormat: IntlNumberFormat
};

var map$1 = {
    map: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'Map';
        },
        replace: function replace(map) {
            return Array.from(map.entries());
        },
        revive: function revive(entries) {
            return new Map(entries);
        }
    }
};

var nan$1 = {
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

var nonbuiltinIgnore$1 = {
    nonbuiltinIgnore: {
        test: function test(x) {
            return x && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && !Array.isArray(x) && !['Object',
            // `Proxy` and `Reflect`, two other built-in objects, will also
            //   have a `toStringTag` of `Object`; we don't want built-in
            //   function objects, however
            'Boolean', 'Number', 'String', 'Error', 'RegExp', 'Math', 'Date', 'Map', 'Set', 'JSON', 'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'Promise', 'String Iterator', 'Array Iterator', 'Map Iterator', 'Set Iterator', 'WeakMap', 'WeakSet', 'Atomics', 'Module'].includes(Typeson$1.toStringTag(x));
        },
        replace: function replace(rexp) {}
    }
};

// This module is for objectified primitives (such as `new Number(3)` or
//      `new String("foo")`)
/* eslint-disable no-new-wrappers */
var primitiveObjects$1 = {
    // String Object (not primitive string which need no type spec)
    StringObject: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'String' && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
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
            return Typeson$1.toStringTag(x) === 'Boolean' && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
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
            return Typeson$1.toStringTag(x) === 'Number' && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
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

var regexp$1 = {
    regexp: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'RegExp';
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

var resurrectableObjectsByUUID = {};

// TODO: We could use `import generateUUID from 'uuid/v4';` (but it needs crypto library, etc.)
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

var resurrectable$1 = {
    resurrectable: {
        test: function test(x) {
            return x && !Array.isArray(x) && ['object', 'function', 'symbol'].includes(typeof x === 'undefined' ? 'undefined' : _typeof(x));
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

var set$2 = {
    set: {
        test: function test(x) {
            return Typeson$1.toStringTag(x) === 'Set';
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
var _global$1 = typeof self === 'undefined' ? global : self;

// Support all kinds of typed arrays (views of ArrayBuffers)
var exportObj$1 = {};
['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'].forEach(function (typeName) {
    var arrType = typeName;
    var TypedArray = _global$1[typeName];
    if (TypedArray) {
        exportObj$1[typeName.toLowerCase()] = {
            test: function test(x) {
                return Typeson$1.toStringTag(x) === arrType;
            },
            replace: function replace(a) {
                return (a.byteOffset === 0 && a.byteLength === a.buffer.byteLength ? a
                // socket.io supports streaming ArrayBuffers. If we have a typed array
                // representing a portion of the buffer, we need to clone the buffer before leaving it
                // to socket.io.
                : a.slice(0)).buffer;
            },
            revive: function revive(buf) {
                // One may configure socket.io to revive binary data as Buffer or Blob.
                // We should therefore not rely on that the instance we get here is an ArrayBuffer
                // If not, let's assume user wants to receive it as configured with socket.io.
                return Typeson$1.toStringTag(buf) === 'ArrayBuffer' ? new TypedArray(buf) : buf;
            }
        };
    }
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var base64Arraybuffer = createCommonjsModule(function (module, exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function () {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function (arraybuffer, offset, length) {
    var bytes = new Uint8Array(arraybuffer, offset || 0, length !== undefined ? length : arraybuffer.byteLength),
        i,
        len = bytes.length,
        base64 = "";

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode = function (base64) {
    var bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };
})();
});

var base64Arraybuffer_1 = base64Arraybuffer.encode;
var base64Arraybuffer_2 = base64Arraybuffer.decode;

/* eslint-env browser, node */
var _global$2 = typeof self === 'undefined' ? global : self;

var exportObj$2 = {};
['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'].forEach(function (typeName) {
    var arrType = typeName;
    var TypedArray = _global$2[arrType];
    if (TypedArray) {
        exportObj$2[typeName.toLowerCase()] = {
            test: function test(x) {
                return Typeson$1.toStringTag(x) === arrType;
            },
            replace: function replace(a) {
                return base64Arraybuffer_1(a.buffer, a.byteOffset, a.byteLength);
            },
            revive: function revive(b64) {
                return new TypedArray(base64Arraybuffer_2(b64));
            }
        };
    }
});

// This does not preserve `undefined` in sparse arrays; see the `undefined` or `sparse-undefined` preset
var undef$1 = {
    undef: {
        test: function test(x, stateObj) {
            return typeof x === 'undefined' && (stateObj.ownKeys || !('ownKeys' in stateObj));
        },
        replace: function replace(n) {
            return null;
        },
        revive: function revive(s) {
            return new Typeson$1.Undefined();
        } // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)

    }
};

var userObject$1 = {
    userObject: {
        test: function test(x, stateObj) {
            return Typeson$1.isUserObject(x);
        },
        replace: function replace(n) {
            return Object.assign({}, n);
        },
        revive: function revive(s) {
            return s;
        }
    }
};

var sparseUndefined$1 = [{
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

var presetUndefined = [sparseUndefined$1, undef$1];

var specialNumbers$1 = [nan$1, infinity$1, NegativeInfinity];

/* This preset includes types that are built-in into the JavaScript language itself, this
   should work universally. Types that were added in ES6 or beyond will be checked before inclusion
   so that this module can be consumed by both ES5 and ES6 environments.
   Some types cannot be encapsulated because their inner state is private: `WeakMap`, `WeakSet`.
   The Function type is not included because their closures would not be serialized, so a revived
   Function that uses closures would not behave as expected. Symbols are similarly not included.
*/

var expObj = [
// ES5
presetUndefined, primitiveObjects$1, specialNumbers$1, date$1, error$1, exportObj, regexp$1].concat(
// ES2015 (ES6)
typeof Map === 'function' ? map$1 : [], typeof Set === 'function' ? set$2 : [], typeof ArrayBuffer === 'function' ? arraybuffer$1 : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview$1 : [], typeof Intl !== 'undefined' ? intlTypes$1 : []);

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

var postMessage$1 = [error$1, exportObj];

var socketio = [expObj, { ArrayBuffer: null }, // Leave ArrayBuffer as is, and let socket.io stream it instead.
exportObj$1 // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
];

/* This preset includes types for the Structured Cloning Algorithm. */

var expObj$1 = [
// Todo: Might also register synchronous `ImageBitmap` and `Blob`/`File`/`FileList`?
// ES5
userObject$1, // Processed last (non-builtin)

presetUndefined, primitiveObjects$1, specialNumbers$1, date$1, regexp$1,

// Non-built-ins
imagedata$1, imagebitmap$1, // Async return
file$1, filelist$1, blob$1].concat(
// ES2015 (ES6)
typeof Map === 'function' ? map$1 : [], typeof Set === 'function' ? set$2 : [], typeof ArrayBuffer === 'function' ? arraybuffer$1 : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview$1 : [], typeof Intl !== 'undefined' ? intlTypes$1 : []);

var structuredCloningThrowing$1 = expObj$1.concat({ checkDataCloneException: [function (val) {
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
        ].includes(typeof val === 'undefined' ? 'undefined' : _typeof(val)) || ['Arguments', // A non-array exotic object
        'Module', // A non-array exotic object
        'Error', // `Error` and other errors have the [[ErrorData]] internal slot and give "Error"
        'Promise', // Promise instances have an extra slot ([[PromiseState]]) but not throwing in Chrome `postMessage`
        'WeakMap', // WeakMap instances have an extra slot ([[WeakMapData]]) but not throwing in Chrome `postMessage`
        'WeakSet' // WeakSet instances have an extra slot ([[WeakSetData]]) but not throwing in Chrome `postMessage`
        ].includes(stringTag) || val === Object.prototype || // A non-array exotic object but not throwing in Chrome `postMessage`
        (stringTag === 'Blob' || stringTag === 'File') && val.isClosed || val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' &&
        // Duck-type DOM node objects (non-array exotic? objects which
        //    cannot be cloned by the SCA)
        typeof val.nodeType === 'number' && typeof val.insertBefore === 'function') {
            throw new DOMException('The object cannot be cloned.', 'DataCloneError');
        }
        return false;
    }] });

var universal$1 = [expObj
// TODO: Add types that are de-facto universal even though not built-in into ecmasript standard.
];

// This file is auto-generated from `build.js`
// TYPES
// PRESETS
Typeson$1.types = {
    arraybuffer: arraybuffer$1, blob: blob$1, cloneable: cloneable$1, dataview: dataview$1, date: date$1, error: error$1, errors: exportObj, file: file$1, filelist: filelist$1,
    imagebitmap: imagebitmap$1, imagedata: imagedata$1, infinity: infinity$1, intlTypes: intlTypes$1, map: map$1, nan: nan$1, negativeInfinity: NegativeInfinity,
    nonbuiltinIgnore: nonbuiltinIgnore$1, primitiveObjects: primitiveObjects$1, regexp: regexp$1, resurrectable: resurrectable$1, set: set$2,
    typedArraysSocketio: exportObj$1, typedArrays: exportObj$2, undef: undef$1, userObject: userObject$1
};
Typeson$1.presets = {
    builtin: expObj, postMessage: postMessage$1, socketio: socketio, sparseUndefined: sparseUndefined$1, specialNumbers: specialNumbers$1,
    structuredCloningThrowing: structuredCloningThrowing$1, structuredCloning: expObj$1, undef: presetUndefined, universal: universal$1
};

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
    return { obj: JSON.stringify(this.obj) };
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

/* eslint-env node */
// Imperfectly polyfill jsdom for testing `Blob`/`File`
// Todo: This can be removed once `URL.createObjectURL` may
//    be implemented in jsdom: https://github.com/tmpvar/jsdom/issues/1721

// These are not working well with Rollup as imports
var mod = typeof module !== 'undefined';
var uuid = mod && require('uuid/v4');
var whatwgURL = mod && require('whatwg-url') || {};
// We also need to tweak `XMLHttpRequest` which our types
//    rely on to obtain the Blob/File content
var utils = mod && require('jsdom/lib/jsdom/living/generated/utils') || {};

var serializeURLOrigin = whatwgURL.serializeURLOrigin;
var parseURL = whatwgURL.parseURL;


var blobURLs = {};
var createObjectURL = function createObjectURL(blob) {
    // https://github.com/tmpvar/jsdom/issues/1721#issuecomment-282465529
    var blobURL = 'blob:' + serializeURLOrigin(parseURL(location.href)) + '/' + uuid();
    blobURLs[blobURL] = blob;
    return blobURL;
};

var impl = utils.implSymbol;
var _xhropen = XMLHttpRequest.prototype.open;

// Add to XMLHttpRequest.prototype.open
function xmlHttpRequestOpen(method, url, async) {
    if (/^blob:/.test(url)) {
        var blob = blobURLs[url];
        var type = blob.type;
        url = 'data:' + type + ';base64,' + blob[impl]._buffer.toString('base64');
    }
    return _xhropen.call(this, method, url, async);
}

/* eslint-env mocha */
/* globals global, expect, assert, imageTestFileNode */
/* eslint-disable no-unused-expressions */
// For Node (we put here as this is exported and to be usable externally in ES6 module syntax
//     whereas the `test-node.js` file has not been converted to ES6)
if (!URL.createObjectURL) {
    URL.createObjectURL = createObjectURL;
    XMLHttpRequest.prototype.open = xmlHttpRequestOpen;
}

// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/tmpvar/jsdom/issues/1272
var glob = typeof module !== 'undefined' ? global : window;
function FileList() {
    this._files = arguments[0];
    this.length = this._files.length;
}
FileList.prototype.item = function (index) {
    return this._files[index];
};
FileList.prototype[Symbol.toStringTag] = 'FileList';
Object.defineProperty(glob.HTMLInputElement.prototype, 'files', {
    get: function get() {
        return new FileList(this._files);
    },
    set: function set(val) {
        this._files = val;
    }
});
glob.FileList = FileList;

var _Typeson$types = Typeson$1.types;
var errors = _Typeson$types.errors;
var typedArrays = _Typeson$types.typedArrays;
var intlTypes = _Typeson$types.intlTypes;
var undef = _Typeson$types.undef;
var primitiveObjects = _Typeson$types.primitiveObjects;
var nan = _Typeson$types.nan;
var infinity = _Typeson$types.infinity;
var negativeInfinity = _Typeson$types.negativeInfinity;
var date = _Typeson$types.date;
var error = _Typeson$types.error;
var regexp = _Typeson$types.regexp;
var map = _Typeson$types.map;
var set = _Typeson$types.set;
var arraybuffer = _Typeson$types.arraybuffer;
var dataview = _Typeson$types.dataview;
var imagedata = _Typeson$types.imagedata;
var imagebitmap = _Typeson$types.imagebitmap;
var blob = _Typeson$types.blob;
var file = _Typeson$types.file;
var filelist = _Typeson$types.filelist;
var nonbuiltinIgnore = _Typeson$types.nonbuiltinIgnore;
var userObject = _Typeson$types.userObject;
var cloneable = _Typeson$types.cloneable;
var resurrectable = _Typeson$types.resurrectable;
var _Typeson$presets = Typeson$1.presets;
var builtin = _Typeson$presets.builtin;
var universal = _Typeson$presets.universal;
var structuredCloningThrowing = _Typeson$presets.structuredCloningThrowing;
var structuredCloning = _Typeson$presets.structuredCloning;
var specialNumbers = _Typeson$presets.specialNumbers;
var postMessage = _Typeson$presets.postMessage;
var undefPreset = _Typeson$presets.undef;
var sparseUndefined = _Typeson$presets.sparseUndefined;


function ErrorAndErrors(preset) {
    describe('Error and Errors', function () {
        it('should get back real Error instances corresponding to their types and with the original name and message', function () {
            var typeson = new Typeson$1().register(preset || [error, errors]);
            var json = typeson.stringify({
                e1: new Error('Error1'),
                e2: new TypeError('Error2'),
                e3: new RangeError('Error3'),
                e4: new SyntaxError('Error4'),
                e5: new ReferenceError('Error5')
                // , e6: new InternalError('Error6')
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
            expect(obj.e5.name).to.equal('ReferenceError');
            // Non-standard
            // expect(obj.e6).to.be.an.instanceOf(InternalError);
            // expect(obj.e6.name).to.equal('InternalError');
        });
    });
}

function SpecialNumbers(preset) {
    describe('Special numbers', function () {
        it('NaN', function () {
            var typeson = new Typeson$1().register(preset || nan);
            var tson = typeson.stringify(NaN, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.NaN;
        });
        it('Infinity', function () {
            var typeson = new Typeson$1().register(preset || infinity);
            var tson = typeson.stringify(Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(Infinity);
        });
        it('-Infinity', function () {
            var typeson = new Typeson$1().register(preset || negativeInfinity);
            var tson = typeson.stringify(-Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(-Infinity);
        });
        it('should not mistake string forms of the special numbers', function () {
            var typeson = new Typeson$1().register(preset || [nan, infinity, negativeInfinity]);
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
            var typeson = new Typeson$1().register(preset || [nan, infinity, negativeInfinity]);
            var tson = typeson.stringify(512, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(512);
        });
    });
}

function Undefined(preset) {
    describe('undefined type', function () {
        it('should be possible to restore `undefined` properties', function () {
            var typeson = new Typeson$1().register(preset || undef);
            var a = [undefined, { b: undefined, c: [3, null,, undefined] }]; // eslint-disable-line no-sparse-arrays
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
            var typeson = new Typeson$1().register(preset || undef);
            var tson = typeson.stringify(undefined);
            expect(tson).to.equal('{"$":null,"$types":{"$":{"":"undef"}}}');
            var back = typeson.parse(tson);
            expect(back).to.be.undefined;
        });
    });
}

function BuiltIn(preset) {
    Undefined(preset);

    describe('Primitive objects', function () {
        it('String object', function () {
            var typeson = new Typeson$1().register(preset || primitiveObjects);
            var strObj = new String('hello'); // eslint-disable-line no-new-wrappers
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(String);
            expect(back.valueOf()).to.equal('hello');
            expect(back.length).to.equal(5);
        });
        it('Boolean object', function () {
            var typeson = new Typeson$1().register(preset || primitiveObjects);
            var strObj = new Boolean(true); // eslint-disable-line no-new-wrappers
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(true);
        });
        it('Number object', function () {
            var typeson = new Typeson$1().register(preset || primitiveObjects);
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
            var typeson = new Typeson$1().register(preset || date);
            var json = typeson.stringify(new Date(1234567));
            var obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.equal(1234567);
        });
        it('should get back a real invalid Date instance', function () {
            var typeson = new Typeson$1().register(preset || date);
            var json = typeson.stringify(new Date(NaN));
            var obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.be.NaN;
        });
    });

    ErrorAndErrors(preset);

    describe('RegExp', function () {
        it('should return a RegExp', function () {
            var typeson = new Typeson$1().register(preset || [regexp]);
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
            var typeson = new Typeson$1().register(preset || map);
            var map1 = new Map();
            var error = new Error('Error here'),
                date = new Date(10000);

            map1.set(error, date);
            var json = typeson.stringify({ m: map1 });
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
            var typeson = new Typeson$1().register(preset || set);
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

            var json = typeson.stringify({ s: set1 });
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
            var typeson = new Typeson$1().register(preset || [arraybuffer]);
            var buf = new ArrayBuffer(16);
            var tson = typeson.stringify(buf, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof ArrayBuffer);
            expect(back.byteLength).to.equal(16);
        });
    });

    describe('TypedArrays', function () {
        describe('Float64Array', function () {
            it('should get back real Float64Array instance with original array content', function () {
                var typeson = new Typeson$1().register(preset || [arraybuffer, typedArrays]);
                var a = new Float64Array(3);
                a[0] = 23.8;
                a[1] = -15;
                a[2] = 99;
                var json = typeson.stringify({ a: a });
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
                var typeson = new Typeson$1().register(preset || [arraybuffer, typedArrays]);
                var a = new Uint16Array(0x0900);
                var i = a.length;
                while (i--) {
                    a[i] = i + 0xd780;
                }var json = typeson.stringify({ a: a });
                // console.log(json);

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
                var typeson = new Typeson$1().register(preset || [arraybuffer, typedArrays]);
                var a = new Int8Array(3);
                a[0] = 0;
                a[1] = 1;
                a[2] = 2;
                var json = typeson.stringify(a);
                // console.log(json);
                var a2 = typeson.parse(json);
                expect(a2.length).to.equal(3);
                expect(a2[0]).to.equal(0);
                expect(a2[1]).to.equal(1);
                expect(a2[2]).to.equal(2);
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
            var typeson = new Typeson$1().register(preset || [dataview]);
            var sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
            var buffer = new Uint8Array(sample).buffer;
            var dataView = new DataView(buffer, 3, 4);
            expect(dataView.byteLength).to.equal(4);
            var tson = typeson.stringify(dataView, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(DataView);
            expect(back.byteLength).to.equal(4);
        });
    });

    describe('Intl types', function () {
        it('should return a Intl.Collator', function () {
            var typeson = new Typeson$1().register(preset || [intlTypes]);
            // After `-u-`, the values don't appear to be validated in Node or Chrome
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
            expect(back instanceof Intl.Collator);
            // console.log(Intl.Collator.supportedLocalesOf(Object.keys(optsClone.locales), optsClone.localeMatcher));

            expect(back.resolvedOptions().locale).to.deep.equal(expectedLocale);

            Object.keys(optsClone).filter(function (k) {
                return ![
                // These would ideally be present but are not available for inspection
                'localeMatcher', 'locales'].includes(k);
            }).forEach(function (prop) {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
        it('should return a Intl.DateTimeFormat', function () {
            var typeson = new Typeson$1().register(preset || [intlTypes]);
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
                return ![
                // These would ideally be present but are not available for inspection
                'localeMatcher', 'locales', 'formatMatcher', 'hour12' // Not currently working in Node or Chrome
                ].includes(k);
            }).forEach(function (prop) {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
        it('should return a Intl.NumberFormat', function () {
            var typeson = new Typeson$1().register(preset || [intlTypes]);
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
                return ![
                // These would ideally be present but are not available for inspection
                'localeMatcher', 'locales'].includes(k);
            }).forEach(function (prop) {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
    });
}
describe('Built-in', BuiltIn);

describe('ImageData', function () {
    it('should get back an ImageData instance with the original data', function () {
        var typeson = new Typeson$1().register(imagedata);
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
        var typeson = new Typeson$1().register(imagebitmap);

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            createImageBitmap(canvas).then(function (imageBitmap) {
                var tson = typeson.stringify(imageBitmap);
                return typeson.parse(tson);
            }).then(function (back) {
                expect(back.width).to.equal(300 /* img.width */);
                expect(back.height).to.equal(150 /* img.height */);

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try {
                    // Node
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg==');
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
        };
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
    it('should get back an ImageBitmap instance with the original data asynchronously', function (done) {
        var typeson = new Typeson$1().register(imagebitmap);

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
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
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try {
                    // Node
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg==');
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
        };
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
});

describe('Blob', function () {
    it('should get back a Blob instance with the original data', function (done) {
        this.timeout(10000);
        var typeson = new Typeson$1().register(blob);
        var contentType = 'application/json';
        var stringContents = JSON.stringify('abc\u1234');

        var blob1 = new Blob([
        // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
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
        var typeson = new Typeson$1().register(blob);
        var contentType = 'application/json';
        var stringContents = JSON.stringify('abc\u1234');

        var blob1 = new Blob([
        // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
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
});

describe('File', function () {
    this.timeout(10000);
    it('should get back a File instance with the original data', function (done) {
        var typeson = new Typeson$1().register(file);
        var currTime = new Date();
        var contentType = 'application/json';
        var fileName = 'aName';
        var stringContents = JSON.stringify('abc\u1234');
        var file1 = new File([
        // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
        stringContents], fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
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
        var typeson = new Typeson$1().register(file);
        var currTime = new Date();
        var contentType = 'application/json';
        var fileName = 'aName';
        var stringContents = JSON.stringify('abc\u1234');
        var file1 = new File([
        // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
        stringContents], fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
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
        input.files = [// See the test-entry for our adapter to make this settable
        new File(['content1'], 'abc', {
            type: 'text/plain', // DOMString
            lastModified: currTime // Or number
        }), new File(['content2'], 'def', {
            type: 'text/html', // DOMString
            lastModified: anotherTime // Or number
        })];

        expect(input.files).to.be.an.instanceOf(FileList);
        var typeson = new Typeson$1().register(filelist);
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
        input.files = [// See the test-entry for our adapter to make this settable
        new File(['content1'], 'abc', {
            type: 'text/plain', // DOMString
            lastModified: currTime // Or number
        }), new File(['content2'], 'def', {
            type: 'text/html', // DOMString
            lastModified: anotherTime // Or number
        })];

        expect(input.files).to.be.an.instanceOf(FileList);
        var typeson = new Typeson$1().register(filelist);
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
        var typeson = new Typeson$1().register(nonbuiltinIgnore);
        var john = new util.Person('John Doe');
        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        var tson = typeson.stringify({ a: john, b: simulatedNonBuiltInObject });
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: { name: 'John Doe' }
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
        var typeson = new Typeson$1().register([userObject, date]);
        var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        simulatedNonBuiltInObject.prop = 500;
        var tson = typeson.stringify({ a: bob, b: simulatedNonBuiltInObject });
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: { name: 'Bob Smith', age: 30, dob: new Date(2000, 5, 20), isMarried: true },
            b: { aaa: 5, prop: 500 }
        });
        expect('dob' in back.a).to.be.true;
    });
    it('should work with nonbuiltin-ignore', function () {
        var typeson = new Typeson$1().register([userObject, nonbuiltinIgnore]);
        var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
        bob.nonbuiltin = new util.SimulatedNonBuiltIn();
        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        var tson = typeson.stringify({ a: bob, b: simulatedNonBuiltInObject });
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: { name: 'Bob Smith', age: 30, isMarried: true, dob: new Date(2000, 5, 20).toJSON() }
        });
        expect('nonbuiltin' in back.a).to.be.false;
    });
});

describe('Cloneables', function () {
    it('Should work with custom cloneable objects', function () {
        var typeson = new Typeson$1().register(cloneable);
        var objArg = { a: 1, b: 2 };
        var mc = new util.MyCloneable(objArg);
        var originalNonpersistentStateInfo = mc.nonpersistentStateInfo;

        var encapsulated = typeson.encapsulate(mc);
        expect(mc[Symbol.for('cloneEncapsulate')]()).to.deep.equal({ obj: JSON.stringify(objArg) });
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
        var typeson = new Typeson$1().register(resurrectable);
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
    });

    // TODO: Could add a shimmed postMessage test though covered by worker test
    describe('postMessage', function () {
        ErrorAndErrors([postMessage]);
    });

    describe('Universal', function () {
        BuiltIn([universal]);
    });
    describe('Structured cloning', function () {
        it('should work with Structured cloning with throwing', function () {
            var typeson = new Typeson$1().register([structuredCloningThrowing]);
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
            var typeson = new Typeson$1().register([structuredCloning]);
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
            var typeson = new Typeson$1().register([structuredCloning]);
            var john = new util.Person('John Doe');
            var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

            var clonedData = typeson.parse(typeson.stringify([john, bob]));
            expect(clonedData).to.have.same.deep.members([{ name: 'John Doe' }, { name: 'Bob Smith', dob: new Date(2000, 5, 20), age: 30, isMarried: true }]);
        });
    });
    describe('Special Numbers (as preset)', function () {
        SpecialNumbers([specialNumbers]);
    });

    // TODO: Add test for socketio

    describe('Undefined (as preset)', function () {
        Undefined([undefPreset]);
    });

    describe('Sparse undefined', function () {
        it('should be possible to restore `undefined` properties', function () {
            var typeson = new Typeson$1().register([sparseUndefined]);
            var a = [undefined, { b: undefined, c: [3, null,, undefined] }]; // eslint-disable-line no-sparse-arrays
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

})));
