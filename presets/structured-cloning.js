/* This preset includes types for the Structured Cloning Algorithm. */

import userObject from '../types/user-object.js';
import arrayNonindexKeys from './array-nonindex-keys.js';
import undef from '../types/undef.js';
import primitiveObjects from '../types/primitive-objects.js';
import specialNumbers from './special-numbers.js';
import date from '../types/date.js';
import regexp from '../types/regexp.js';
import map from '../types/map.js';
import set from '../types/set.js';
import error from '../types/error.js';
import errors from '../types/errors.js';
import arraybuffer from '../types/arraybuffer.js';
import typedArrays from '../types/typed-arrays.js';
import dataview from '../types/dataview.js';
import intlTypes from '../types/intl-types.js';

import imagedata from '../types/imagedata.js';
import imagebitmap from '../types/imagebitmap.js'; // Async return
import file from '../types/file.js';
import filelist from '../types/filelist.js';
import blob from '../types/blob.js';
import bigint from '../types/bigint.js';
import bigintObject from '../types/bigint-object.js';

import cryptokey from '../types/cryptokey.js';

/**
 * @type {import('typeson').Preset}
 */
const expObj = [
    // Todo: Might also register synchronous `ImageBitmap` and
    //    `Blob`/`File`/`FileList`?
    // ES5
    userObject, // Processed last (non-builtin)

    undef,
    arrayNonindexKeys, primitiveObjects, specialNumbers,
    date, regexp,

    // Non-built-ins
    imagedata,
    imagebitmap, // Async return
    file,
    filelist,
    blob,
    error,
    errors
].concat(
    // ES2015 (ES6)
    /* c8 ignore next */
    typeof Map === 'function' ? map : [],
    /* c8 ignore next */
    typeof Set === 'function' ? set : [],
    /* c8 ignore next */
    typeof ArrayBuffer === 'function' ? arraybuffer : [],
    /* c8 ignore next */
    typeof Uint8Array === 'function' ? typedArrays : [],
    /* c8 ignore next */
    typeof DataView === 'function' ? dataview : [],
    /* c8 ignore next */
    typeof Intl !== 'undefined' ? intlTypes : [],
    /* c8 ignore next */
    typeof crypto !== 'undefined' ? cryptokey : [],
    /* c8 ignore next */
    typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []
);
export default expObj;
