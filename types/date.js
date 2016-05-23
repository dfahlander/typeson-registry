exports.Date = [
    function (x) { return x instanceof Date; },
    function (date) { return date.getTime(); },
    function (time) { return new Date(time); }
];
