export default {
    negativeInfinity: {
        test (x) { return x === -Infinity; },
        replace (n) { return '-Infinity'; },
        revive (s) { return -Infinity; }
    }
};
