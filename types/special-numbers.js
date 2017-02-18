exports.SpecialNumber = [
    function (x) { return typeof x === 'number' && (isNaN(x) || x === Infinity || x === -Infinity); },
    function (n) { return isNaN(n) ? "NaN" : n > 0 ? "Infinity" : "-Infinity" },
    function (s) { return {NaN: NaN, Infinity: Infinity, "-Infinity": -Infinity}[s];}
];
