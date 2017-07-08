var Typeson = require('typeson');
exports.Date = [
    function (x) { return Typeson.toStringTag(x) === 'Date'; },
    function (date) {
        var time = date.getTime();
        if (isNaN(time)) {
            return 'NaN';
        }
        return time;
    },
    function (time) {
        if (time === 'NaN') {
            return new Date(NaN);
        }
        return new Date(time);
    }
];
