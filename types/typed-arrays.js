/* eslint-env browser, node */
import {toStringTag} from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';

const typedArrays = {};

/**
 * @param {
 *   Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|
 *   Uint32Array|Float32Array|Float64Array
 * } TypedArray
 * @returns {void}
 */
function create (TypedArray) {
    const typeName = TypedArray.name;
    typedArrays[typeName.toLowerCase()] = {
        test (x) { return toStringTag(x) === typeName; },
        replace ({buffer, byteOffset, length: l}, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(buffer);
            if (index > -1) {
                return {index, byteOffset, length: l};
            }
            stateObj.buffers.push(buffer);
            return {
                encoded: encode(buffer),
                byteOffset,
                length: l
            };
        },
        revive (b64Obj, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const {byteOffset, length: len, encoded, index} = b64Obj;
            let buffer;
            if ('index' in b64Obj) {
                buffer = stateObj.buffers[index];
            } else {
                buffer = decode(encoded);
                stateObj.buffers.push(buffer);
            }
            return new TypedArray(buffer, byteOffset, len);
        }
    };
}

if (typeof Int8Array === 'function') {
    // Those constructors are added in ES6 as a group.
    // If we have Int8Array, we can assume the rest also exists.
    [
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
    ].forEach((TypedArray) => create(TypedArray));
}

export default typedArrays;
