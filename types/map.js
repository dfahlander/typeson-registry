var Typeson = require('typeson');
var makeArray = require('../utils/array-from-iterator');
exports.Map = [
    function (x) { return Typeson.toStringTag(x) === 'Map'; },
    function (map) { return makeArray(map.entries()); },
    function (entries) { return new Map(entries); }
];
