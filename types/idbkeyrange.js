/* globals IDBKeyRange -- Polyfill needed */

import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const idbkeyrange = {
    idbkeyrange: {
        test (x) {
            return toStringTag(x) === 'IDBKeyRange';
        },
        replace ({lower, upper, lowerOpen, upperOpen}) {
            return {lower, upper, lowerOpen, upperOpen};
        },
        revive ({lower, upper, lowerOpen, upperOpen}) {
            return IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
        }
    }
};

export default idbkeyrange;
