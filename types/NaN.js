exports.NaN = [
    function (x) { return typeof x === 'number' && isNaN(x); },
    function (n) { return 'NaN' },
    function (s) { return NaN;}
];
