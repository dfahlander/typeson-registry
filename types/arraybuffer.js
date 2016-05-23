var B64 = require ('base64-arraybuffer');

var _global = typeof self === 'undefined' ? global : self;

// Support ArrayBuffer
if (_global.ArrayBuffer) {
    exports.ArrayBuffer = [
        function test (x) { return x.constructor === ArrayBuffer;},
        function encapsulate (b) { return B64.encode(b); },
        function revive (b64) { return B64.decode(b64); }
    ];
}

// Support all kinds of typed arrays (views of ArrayBuffers)
[
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array"    
].forEach(function (typeName) {
    var TypedArray = _global[typeName];
    if (TypedArray) exports[typeName] = [
        function test (x) { return x.constructor === TypedArray; },
        function encapsulate (a) { return B64.encode (a.buffer, a.byteOffset, a.byteLength); },
        function revive (b64) { return new TypedArray (B64.decode(b64)); }
    ];
});
