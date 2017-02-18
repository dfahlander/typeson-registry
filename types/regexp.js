var Typeson = require('typeson');
exports.RegExp = [
    function (x) { return Typeson.toStringTag(x) === 'RegExp'; },
    function (rexp) {
        return {
            source: rexp.source,
            flags: (rexp.global?'g':'')+(rexp.ignoreCase?'i':'')+(rexp.multiline?'m':'')
        };
    },
    function (data) { return new RegExp (data.source, data.flags); }
];
