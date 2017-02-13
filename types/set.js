var Typeson = require('typeson');
var makeArray = require('../utils/array-from-iterator');
exports.Set = [
    function (x) { return Typeson.toStringTag(x) === 'Set'; },
    function (set) { return makeArray(set.values()); },
    function (values) { return new Set(values); }
];
