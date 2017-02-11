module.exports = require('./structured-cloning').concat({checkDataCloneException: [function (val) {
    // Should also throw with:
    // 1. `IsDetachedBuffer` (a process not called within the ECMAScript spec)
    // 2. `IsCallable` (covered by `typeof === 'function'` or a function's `toStringTag`)
    // 3. internal slots besides [[Prototype]] or [[Extensible]] (e.g., [[PromiseState]] or [[WeakMapData]])
    // 4. exotic object (e.g., `Proxy`) (which does not have default behavior for one or more of the
    //      essential internal methods that are limited to the following for non-function objects (we auto-exclude functions): 
    //      [[GetPrototypeOf]],[[SetPrototypeOf]],[[IsExtensible]],[[PreventExtensions]],[[GetOwnProperty]],
    //      [[DefineOwnProperty]],[[HasProperty]],[[Get]],[[Set]],[[Delete]],[[OwnPropertyKeys]]);
    //      except for the standard, built-in exotic objects, we'd need to know whether these methods had distinct behaviors
    var stringTag = ({}.toString.call(val).slice(8, -1));
    if ([
            'symbol', // Symbol's `toStringTag` is only "Symbol" for its initial value, so we check `typeof`
            'function' // All functions including bound function exotic objects
        ].includes(typeof val) ||
        [
            'Arguments', // A non-array exotic object
            'Module', // A non-array exotic object
            'Error', // `Error` and other errors have the [[ErrorData]] internal slot and give "Error"
            'Proxy', // Proper `toStringTag` not yet implemented in Chrome/Firefox/Node
            'Promise', // Promise instances have an extra slot ([[PromiseState]]) but not throwing in Chrome `postMessage`
            'WeakMap', // WeakMap instances have an extra slot ([[WeakMapData]]) but not throwing in Chrome `postMessage`
            'WeakSet' // WeakSet instances have an extra slot ([[WeakSetData]]) but not throwing in Chrome `postMessage`
        ].includes(stringTag) ||
        val === Object.prototype || // A non-array exotic object but not throwing in Chrome `postMessage`
        (val && typeof val === 'object' && typeof val.nodeType === 'number' && typeof val.insertBefore === 'function') // Duck-type DOM node objects (non-array exotic? objects which cannot be cloned by the SCA)
    ) {
        throw new DOMException('The object cannot be cloned.', 'DataCloneError');
    }
    return false;
}]});
