var _global = typeof self === 'undefined' ? global : self;

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
        function encapsulate (a) { return (a.byteOffset === 0 && a.byteLength === a.buffer.byteLength ?
            // socket.io supports streaming ArrayBuffers. If we have a typed array
            // representing a portion of the buffer, we need to clone the buffer before leaving it
            // to socket.io.
            a : a.slice(0)).buffer; 
        },
        function revive (buf) {
            // One may configure socket.io to revive binary data as Buffer or Blob.
            // We should therefore not rely on that the instance we get here is an ArrayBuffer
            // If not, lets assume user wants to recieve it as configured with socket.io.
            return buf instanceof ArrayBuffer ? new TypedArray(buf) : buf;
        }
    ];
});
