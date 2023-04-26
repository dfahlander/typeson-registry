// This does not preserve `undefined` in sparse arrays; see the `undef`
//  or `sparse-undefined` preset
import {Undefined} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const undef = {
    undef: {
        test (x, stateObj) {
            return typeof x === 'undefined' &&
                (stateObj.ownKeys || !('ownKeys' in stateObj));
        },
        replace (n) { return 0; },
        revive (s) {
            // Will add `undefined` (returning `undefined` would instead
            //   avoid explicitly setting)
            return new Undefined();
        }
    }
};

export default undef;
