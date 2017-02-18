var Typeson = require('typeson');
exports.userObjects = [
    function (x, stateObj) { return Typeson.isUserObject(x); },
    function (n) { return Object.assign({}, n); },
    function (s) { return s;}
];
