function isTypedArray(Class) {
    return Class && Class.BYTES_PER_ELEMENT && /\Array ?\(\) ?{\s+\[native code\]/.test(Class);        
}

function isSpecial(char) {
    return ((char > 0xd7ff && char < 0xe000) || char === 0xfffd);
}

function funcName(func) {
    return func.name || (func+'').match(/function (.*)\(/)[1];        
}

var _global = typeof self === 'undefined' ? global : self;

module.exports = {
    TypedArray: [
        // Tester
        function (x) { return isTypedArray(x.constructor); },
        // Encapsulator
        function (a) {
            // Convert Typed Array to direct unicode string, but record invalid chars separately since they
            // would otherwise get lost when string is encoded to an UTF-x format.
            var uint16View = new Uint16Array(a.buffer, a.byteOffset, Math.floor(a.byteLength / 2));
            var invalids = uint16View.filter(isSpecial).map(function (ch) { return ch - 0xd7E0; });
            return {
                data: String.fromCharCode.apply(null, uint16View),
                inv: String.fromCharCode.apply(null, invalids),
                type: funcName(a.constructor), // "Uint8Array", "Int8Array", "Uint16Array", ...
                xtra: a.byteLength % 2 ? a[a.byteLength-1] : undefined
            };
        },
        // Reviver
        function (o) {
            var data = o.data,
                invalids = o.inv,
                extraByte = 'xtra' in o,
                l = data.length, i = invalids.length, ch,
                buf = new ArrayBuffer(2*l + extraByte),
                arr = new Uint16Array(buf);
            while (l--) {
                if (isSpecial(arr[l] = data.charCodeAt(l))) {
                    arr[l] = invalids.charCodeAt(--i) + 0xd7e0;
                }
            }
            var TypedArray = _global[o.type]; // Int8Array, Uint8Array, Int16Array, Uint16Array, ...
            if (!isTypedArray(TypedArray)) throw new Error ("Could not instanciate " + o.type);
            var rv = new TypedArray(buf);
            if (extraByte) arr[buf.length - 1] = o.xtra; // Only possible for 8-bit arrays.
            return rv;
        }
    ]
};
