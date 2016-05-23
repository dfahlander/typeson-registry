// This module is for objectified primitives (such as new Number(3) or
// new String("foo"))
module.exports = {
    // String Object (not primitive string which need no type spec)
    StringObject: [
        function (x) { return x.constructor === String && typeof x === 'object'; },
        function (s) { return String(s); }, // convert to primitive string
        function (s) { return new String(s); } // Revive to an objectified string
    ],
    // Boolean Object (not primitive boolean which need no type spec)
    BooleanObject: [
        function (x) { return x.constructor === Boolean && typeof x === 'object'; },
        function (b) { return Boolean(b); }, // convert to primitive boolean
        function (b) { return new Boolean(b); } // Revive to an objectified Boolean
    ],
    // Number Object (not primitive number which need no type spec)
    NumberObject: [
        function (x) { return x.constructor === Number && typeof x === 'object'; },
        function (n) { return Number(n); }, // convert to primitive number
        function (n) { return new Number(n); } // Revive to an objectified number
    ]
};
