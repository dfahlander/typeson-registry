module.exports = {
    Map: [
        function (x) { return typeof Map !== 'undefined' && x.constructor === Map; },
        function (map) { return Array.from(map.entries()); },
        function (entries) { return new Map(entries); }
    ]
};
