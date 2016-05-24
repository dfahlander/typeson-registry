var makeArray = require('../utils/array-from-iterator');
exports.Map = [
    function (x) { return x.constructor === Map; },
    function (map) { return makeArray(map.entries()); },
    function (entries) { return new Map(entries); }
];
