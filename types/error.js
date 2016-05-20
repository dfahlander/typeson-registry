module.exports = {
    Error: [
        function (x) { return x instanceof Error; },
        function (error) { return {name: error.name, message: error.message}; },
        function (data) {
            var e = new Error (data.message);
            e.name = data.name;
            return e;
        }
    ],
    TypeError: [
        function (x) { return x instanceof TypeError; },
        function (error) { return error.message; },
        function (data) { return new TypeError (data.message); }
    ],
    RangeError: [
        function (x) { return x instanceof RangeError; },
        function (error) { return error.message; },
        function (data) { return new RangeError (data.message); }
    ],
    SyntaxError: [
        function (x) { return x instanceof SyntaxError; },
        function (error) { return error.message; },
        function (data) { return new SyntaxError (data.message); }
    ],
    ReferenceError: [
        function (x) { return x instanceof ReferenceError; },
        function (error) { return error.message; },
        function (data) { return new ReferenceError (data.message); }
    ]    
};
