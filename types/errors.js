var _global = typeof self === 'undefined' ? global : self;

// Comprises all built-in errors.
[
    "TypeError", 
    "RangeError",
    "SyntaxError",
    "ReferenceError",
    "EvalError",
    "URIError",
    "InternalError"
].forEach(function (errName) {
    var constructor = _global[errName];
    if (constructor) exports[errName] = [
        function (x) { return x.constructor === constructor; },
        function (e) { return e.message; },
        function (message) { return new constructor (message); }
    ]
});
