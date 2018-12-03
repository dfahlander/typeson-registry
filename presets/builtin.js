/* This preset includes types that are built-in into the JavaScript
    language itself, this should work universally.

  Types that were added in ES6 or beyond will be checked before inclusion
   so that this module can be consumed by both ES5 and ES6 environments.

  Some types cannot be encapsulated because their inner state is private:
    `WeakMap`, `WeakSet`.

  The Function type is not included because their closures would not be
    serialized, so a revived Function that uses closures would not behave
    as expected.

  Symbols are similarly not included.
*/

import arrayNonindexKeys from '../types/array-nonindex-keys.js';
import undef from '../types/undef.js';
import primitiveObjects from '../types/primitive-objects.js';
import specialNumbers from '../presets/special-numbers.js';
import date from '../types/date.js';
import error from '../types/error.js';
import errors from '../types/errors.js';
import regexp from '../types/regexp.js';
import map from '../types/map.js';
import set from '../types/set.js';
import arraybuffer from '../types/arraybuffer.js';
import typedArrays from '../types/typed-arrays.js';
import dataview from '../types/dataview.js';
import intlTypes from '../types/intl-types.js';
import bigint from '../types/bigint.js';
import bigintObject from '../types/bigint-object.js';

const expObj = [
    undef,
    // ES5
    arrayNonindexKeys, primitiveObjects, specialNumbers,
    date, error, errors, regexp
].concat(
    // ES2015 (ES6)
    typeof Map === 'function' ? map : [],
    typeof Set === 'function' ? set : [],
    typeof ArrayBuffer === 'function' ? arraybuffer : [],
    typeof Uint8Array === 'function' ? typedArrays : [],
    typeof DataView === 'function' ? dataview : [],
    typeof Intl !== 'undefined' ? intlTypes : [],

    typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []
);
export default expObj;
