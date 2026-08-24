// This module is for objectified primitives (such as `new Number(3)` or
//      `new String("foo")`)
/* eslint-disable no-new-wrappers, unicorn/new-for-builtins -- Deliberate */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const primitiveObjects = {
    // String Object (not primitive string which need no type spec)
    StringObject: {
        test (x) {
            return toStringTag(x) === 'String' && typeof x === 'object';
        },
        replace: String, // convert to primitive string
        revive (s) { return new String(s); } // Revive to an objectified string
    },
    // Boolean Object (not primitive boolean which need no type spec)
    BooleanObject: {
        test (x) {
            return toStringTag(x) === 'Boolean' &&
                typeof x === 'object';
        },
        replace (o) {
            // convert to primitive boolean
            return o.valueOf();
        },
        revive (b) {
            // Revive to an objectified Boolean
            return new Boolean(b);
        }
    },
    // Number Object (not primitive number which need no type spec)
    NumberObject: {
        test (x) {
            return toStringTag(x) === 'Number' && typeof x === 'object';
        },
        // `_encapsulate`'s nested-replace guard (`_stateObj.replaced`)
        //   means a bare `NaN`/`Infinity`/`-Infinity`/`-0` returned here
        //   would skip the sentinel treatment the bare `nan`/`infinity`/
        //   `negativeZero` type specs normally give those values (since
        //   we're already inside this spec's own `replace()`) -- JSON
        //   can't represent them, so they'd otherwise silently become
        //   `null` (or lose their sign, for `-0`). Encode them the same
        //   way those specs do, directly, rather than relying on that
        //   nested pass.
        replace (o) {
            const n = o.valueOf();
            if (Number.isNaN(n)) {
                return 'NaN';
            }
            if (n === Infinity) {
                return 'Infinity';
            }
            if (n === -Infinity) {
                return '-Infinity';
            }
            if (Object.is(n, -0)) {
                // A plain `0` here would be indistinguishable from a
                //   genuine positive `0` once round-tripped through JSON
                //   (which can't represent the sign), so this needs its
                //   own sentinel too, same as the others above.
                return '-0';
            }
            return n;
        },
        // Revive to an objectified number
        revive (n) {
            if (n === 'NaN') {
                return new Number(NaN);
            }
            if (n === 'Infinity') {
                return new Number(Infinity);
            }
            if (n === '-Infinity') {
                return new Number(-Infinity);
            }
            if (n === '-0') {
                return new Number(-0);
            }
            return new Number(n);
        }
    }
};
/* eslint-enable no-new-wrappers, unicorn/new-for-builtins -- Deliberate */

export default primitiveObjects;
