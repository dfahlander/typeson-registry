const infinity = {
    infinity: {
        test (x) { return x === Infinity; },
        replace (n) { return 'Infinity'; },
        revive (s) { return Infinity; }
    }
};

export default infinity;
