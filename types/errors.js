var Typeson = require('typeson');
var _global = typeof self === 'undefined' ? global : self;

// Comprises all built-in errors.
[
    "TypeError",
    "RangeError",
    "SyntaxError",
    "ReferenceError",
    "EvalError",
    "URIError",
    "InternalError" // non-standard
].forEach(function (errName) {
    var constructor = _global[errName];
    if (constructor) exports[errName] = [
        function (x) { return Typeson.hasConstructorOf(x, constructor); },
        function (e) { return e.message; },
        function (message) { return new constructor (message); }
    ]
});
