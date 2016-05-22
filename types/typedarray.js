var b64 = require ('base64-arraybuffer');

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
            return {
                data: b64.encode (a.buffer, a.byteOffset, a.byteLength),
                type: funcName(a.constructor) // "Uint8Array", "Int8Array", "Uint16Array", ...
            };
        },
        // Reviver
        function (o) {
            var buf = b64.decode (o.data);
            var TypedArray = _global[o.type]; // Int8Array, Uint8Array, Int16Array, Uint16Array, ...
            if (!isTypedArray(TypedArray)) throw new Error ("Could not instanciate " + o.type);
            return new TypedArray(buf);
        }
    ]
};
