const nan = {
    nan: {
        test (x) { return typeof x === 'number' && isNaN(x); },
        replace (n) { return 'NaN'; },
        revive (s) { return NaN; }
    }
};

export default nan;
