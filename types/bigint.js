/* globals BigInt */
export default {
    bigint: {
        test (x) { return typeof x === 'bigint'; }, // eslint-disable-line valid-typeof
        replace (n) { return String(n); },
        revive (s) { return BigInt(s); }
    }
};
