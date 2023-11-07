/**
 * @type {import('typeson').TypeSpecSet}
 */
const bigint = {
    bigint: {
        test (x) {
            return typeof x === 'bigint';
        },
        replace: String,
        // eslint-disable-next-line unicorn/prefer-native-coercion-functions
        revive (s) {
            return BigInt(/** @type {string} */ (s));
        }
    }
};

export default bigint;
