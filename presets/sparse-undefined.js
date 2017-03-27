module.exports = [
    {
        sparseArrays: {
            testPlainObjects: true,
            test: function (x) {return Array.isArray(x);},
            replace: function (a, stateObj) {
                stateObj.iterateUnsetNumeric = true;
                return a;
            }
        }
    },
    {
        sparseUndefined: {
            test: function (x, stateObj) { return typeof x === 'undefined' && stateObj.ownKeys === false; },
            replace: function (n) { return null; },
            revive: function (s) { return undefined;} // Will avoid adding anything
        }
    }
];
