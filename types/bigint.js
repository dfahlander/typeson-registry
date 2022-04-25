/* globals BigInt */

const bigint = {
    bigint: {
        test (x) {
            return typeof x === 'bigint';
        },
        replace: String,
        revive: BigInt
    }
};

export default bigint;
