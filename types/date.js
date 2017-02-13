var Typeson = require('typeson');
exports.Date = [
    function (x) { return Typeson.toStringTag(x) === 'Date'; },
    function (date) { return date.getTime(); },
    function (time) { return new Date(time); }
];
