import {hasConstructorOf} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const bigintObject = {
    bigintObject: {
        test (x) {
            return typeof x === 'object' && hasConstructorOf(x, BigInt);
        },
        replace: String,
        revive (s) {
            // Filed this to avoid error: https://github.com/eslint/eslint/issues/11810
            // eslint-disable-next-line no-new-object
            return new Object(BigInt(/** @type {string} */ (s)));
        }
    }
};

export default bigintObject;
