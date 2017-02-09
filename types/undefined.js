var Typeson = require('typeson');
module.exports = {
    undefined: [
        function (x, stateObj) { return typeof x === 'undefined' && stateObj.ownKeys; },
        function (n) { return null; },
        function (s) { return new Typeson.Undefined();} // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)
    ],
    sparseUndefined: [
        function (x, stateObj) { return typeof x === 'undefined' && !stateObj.ownKeys; },
        function (n) { return null; },
        function (s) { return undefined;} // Will avoid adding anything
    ]
};
