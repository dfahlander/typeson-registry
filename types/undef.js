// This does not preserve `undefined` in sparse arrays; see the `undefined` or `sparse-undefined` preset
import Typeson from 'typeson';

export default {
    undef: {
        test (x, stateObj) {
            return typeof x === 'undefined' &&
                (stateObj.ownKeys || !('ownKeys' in stateObj));
        },
        replace (n) { return null; },
        revive (s) { return new Typeson.Undefined(); } // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)
    }
};
