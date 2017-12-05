export default {
    nan: {
        test (x) { return typeof x === 'number' && isNaN(x); },
        replace (n) { return 'NaN'; },
        revive (s) { return NaN; }
    }
};
