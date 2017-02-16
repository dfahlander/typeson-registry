var Typeson = require('typeson');
exports.nonBuiltInIgnore = [
    function (x) { return x && typeof x === 'object' && !Array.isArray(x) && Typeson.toStringTag(x) !== 'Object'; },
    function (rexp) { return; }
];
