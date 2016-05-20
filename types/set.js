module.exports = {
    Set: [
        function (x) { return typeof Set !== 'undefined' && x.constructor === Set; },
        function (set) { return Array.from(set.values()); },
        function (values) { return new Set(values); }
    ]
};
