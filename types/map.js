exports.Map = [
    function (x) { return x.constructor === Map; },
    function (map) { return Array.from(map.entries()); },
    function (entries) { return new Map(entries); }
];
