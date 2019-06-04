/* globals BigInt */

const bigint = {
    bigint: {
        test (x) {
            // eslint-disable-next-line valid-typeof
            return typeof x === 'bigint';
        },
        replace (n) { return String(n); },
        revive (s) { return BigInt(s); }
    }
};

export default bigint;
