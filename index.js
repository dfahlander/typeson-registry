(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Typeson = factory());
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
        ret = hasConstructorOf(ret, Undefined) ? undefined : ret;
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
                    if (hasConstructorOf(val, Undefined)) _clone[key] = undefined;else if (val !== undefined) _clone[key] = val;
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
                    if (hasConstructorOf(val, Undefined)) _clone2[_key] = undefined;else if (val !== undefined) _clone2[_key] = val;else break;
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

function Undefined() {}

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
Typeson$1.Undefined = Undefined; // To insist `undefined` should be added
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

var arraybuffer = {
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

var blob = {
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

var cloneable = {
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

var dataview = {
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

var date = {
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

var error = {
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

var file = {
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

var filelist = {
    file: file.file,
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
var imagebitmap = {
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
var imagedata = {
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

var intlTypes = {
    IntlCollator: IntlCollator,
    IntlDateTimeFormat: IntlDateTimeFormat,
    IntlNumberFormat: IntlNumberFormat
};

var map = {
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
var primitiveObjects = {
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

var regexp = {
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

var resurrectable = {
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

var set$1 = {
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
                return encode(a.buffer, a.byteOffset, a.byteLength);
            },
            revive: function revive(b64) {
                return new TypedArray(decode(b64));
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
            return new Typeson$1.Undefined();
        } // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)

    }
};

var userObject = {
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

var presetUndefined = [sparseUndefined, undef];

var specialNumbers = [nan, infinity, NegativeInfinity];

/* This preset includes types that are built-in into the JavaScript language itself, this
   should work universally. Types that were added in ES6 or beyond will be checked before inclusion
   so that this module can be consumed by both ES5 and ES6 environments.
   Some types cannot be encapsulated because their inner state is private: `WeakMap`, `WeakSet`.
   The Function type is not included because their closures would not be serialized, so a revived
   Function that uses closures would not behave as expected. Symbols are similarly not included.
*/

var expObj = [
// ES5
presetUndefined, primitiveObjects, specialNumbers, date, error, exportObj, regexp].concat(
// ES2015 (ES6)
typeof Map === 'function' ? map : [], typeof Set === 'function' ? set$1 : [], typeof ArrayBuffer === 'function' ? arraybuffer : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview : [], typeof Intl !== 'undefined' ? intlTypes : []);

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

var socketio = [expObj, { ArrayBuffer: null }, // Leave ArrayBuffer as is, and let socket.io stream it instead.
exportObj$1 // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
];

/* This preset includes types for the Structured Cloning Algorithm. */

var expObj$1 = [
// Todo: Might also register synchronous `ImageBitmap` and `Blob`/`File`/`FileList`?
// ES5
userObject, // Processed last (non-builtin)

presetUndefined, primitiveObjects, specialNumbers, date, regexp,

// Non-built-ins
imagedata, imagebitmap, // Async return
file, filelist, blob].concat(
// ES2015 (ES6)
typeof Map === 'function' ? map : [], typeof Set === 'function' ? set$1 : [], typeof ArrayBuffer === 'function' ? arraybuffer : [], typeof Uint8Array === 'function' ? exportObj$2 : [], typeof DataView === 'function' ? dataview : [], typeof Intl !== 'undefined' ? intlTypes : []);

var structuredCloningThrowing = expObj$1.concat({ checkDataCloneException: [function (val) {
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

var universal = [expObj
// TODO: Add types that are de-facto universal even though not built-in into ecmasript standard.
];

// This file is auto-generated from `build.js`
// TYPES
// PRESETS
Typeson$1.types = {
    arraybuffer: arraybuffer, blob: blob, cloneable: cloneable, dataview: dataview, date: date, error: error, errors: exportObj, file: file, filelist: filelist,
    imagebitmap: imagebitmap, imagedata: imagedata, infinity: infinity, intlTypes: intlTypes, map: map, nan: nan, negativeInfinity: NegativeInfinity,
    nonbuiltinIgnore: nonbuiltinIgnore, primitiveObjects: primitiveObjects, regexp: regexp, resurrectable: resurrectable, set: set$1,
    typedArraysSocketio: exportObj$1, typedArrays: exportObj$2, undef: undef, userObject: userObject
};
Typeson$1.presets = {
    builtin: expObj, postMessage: postMessage, socketio: socketio, sparseUndefined: sparseUndefined, specialNumbers: specialNumbers,
    structuredCloningThrowing: structuredCloningThrowing, structuredCloning: expObj$1, undef: presetUndefined, universal: universal
};

return Typeson$1;

})));
