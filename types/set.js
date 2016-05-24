var makeArray = require('../utils/array-from-iterator');
exports.Set = [
    function (x) { return x.constructor === Set; },
    function (set) { return makeArray(set.values()); },
    function (values) { return new Set(values); }
];
