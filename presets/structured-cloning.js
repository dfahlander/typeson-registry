/* This preset includes types for the Structured Cloning Algorithm. */
exports.StructuredCloning = [
    // Todo: Might also register `ImageBitmap` and synchronous `Blob`/`File`/`FileList`
    // ES5
    require('../types/undefined'),
    require('../types/primitive-objects'),
    require('../types/special-numbers'),
    require('../types/date'),
    require('../types/regexp'),
    // ES2015 (ES6)
    typeof Map === 'function' && require('../types/map'),
    typeof Set === 'function' && require('../types/set'),
    typeof ArrayBuffer === 'function' && require('../types/arraybuffer'),
    typeof Uint8Array === 'function' && require('../types/typed-arrays'),
    typeof DataView === 'function' && require('../types/dataview'),
    typeof Intl !== 'undefined' && require('../types/intl-types'),
    // Non-built-ins
    require('../types/imagedata')
];
exports.StructuredCloningErrorThrowing = [function (val) {
    // Should also throw with:
    // 1. `IsDetachedBuffer` (a process not called within the ECMAScript spec)
    // 2. `IsCallable` (covered by `typeof === 'function'` or a function's `toStringTag`)
    // 3. internal slots besides [[Prototype]] or [[Extensible]] (e.g., [[PromiseState]] or [[WeakMapData]])
    // 4. exotic object (e.g., `Proxy`)
    var stringTag = ({}.toString.call(val).slice(8, -1));
    if (typeof val === 'symbol' || // Symbol's `toStringTag` is only "Symbol" for its initial value, so we check `typeof`
        [
            'Function', // All functions
            'Error', // `Error` and other errors have the [[ErrorData]] internal slot and give "Error"
            'Proxy', // Proper `toStringTag` not yet implemented in Chrome/Firefox/Node
            'Promise', // Promise instances have an extra slot ([[PromiseState]]) but not throwing in Chrome `postMessage`
            'WeakMap', // WeakMap instances have an extra slot ([[WeakSetData]]) but not throwing in Chrome `postMessage`
            'WeakSet' // WeakSet instances have an extra slot ([[WeakSetData]]) but not throwing in Chrome `postMessage`
        ].includes(stringTag)
    ) {
        throw new DOMException('The object cannot be cloned.', 'DataCloneError');
    }
    return false;
}];
