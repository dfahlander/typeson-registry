exports.RegExp = [
    function (x) { return x instanceof RegExp; },
    function (rexp) {
        return {
            source: rexp.source,
            flags: (rexp.global?'g':'')+(rexp.ignoreCase?'i':'')+(rexp.multiLine?'m':'')
        };
    },
    function (data) { return new RegExp (data.source, data.flags); }
];
