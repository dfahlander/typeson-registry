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
            return new Object(BigInt(/** @type {string} */ (s)));
        }
    }
};

export default bigintObject;
