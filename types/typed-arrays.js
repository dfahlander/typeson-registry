/* eslint-env browser, node */
import {toStringTag} from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const typedArrays = {};

/**
 * @typedef {Int8ArrayConstructor|Uint8ArrayConstructor|
 *   Uint8ClampedArrayConstructor|
 *   Int16ArrayConstructor|Uint16ArrayConstructor|
 *   Int32ArrayConstructor|Uint32ArrayConstructor|
 *   Float32ArrayConstructor|
 *   Float64ArrayConstructor|
 *   BigInt64ArrayConstructor|BigUint64ArrayConstructor} TypedArrayConstructor
 */

/**
 * @param {TypedArrayConstructor} TypedArray
 * @returns {void}
 */
function create (TypedArray) {
    const typeName = TypedArray.name;

    typedArrays[typeName.toLowerCase()] = {
        test (x) { return toStringTag(x) === typeName; },
        replace (
            {buffer, byteOffset, length: l},
            /**
             * @type {import('typeson').StateObject & {
             *   buffers?: ArrayBuffer[]
             * }}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(buffer);
            if (index > -1) {
                return {index, byteOffset, length: l};
            }
            stateObj.buffers.push(buffer);
            return {
                maxByteLength: buffer.maxByteLength,
                encoded: encode(buffer),
                byteOffset,
                length: l
            };
        },
        revive (
            b64Obj,
            /**
             * @type {import('typeson').StateObject & {
             *   buffers?: ArrayBuffer[]
             * }}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const {
                byteOffset, length: len, encoded, index, maxByteLength
            } = b64Obj;
            let buffer;
            if ('index' in b64Obj) {
                buffer = stateObj.buffers[index];
            } else {
                buffer = decode(
                    encoded,
                    /* c8 ignore next 3 -- Depends on Node version */
                    maxByteLength === undefined
                        ? undefined
                        : {maxByteLength}
                );
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
        Float64Array,
        ...(typeof BigInt64Array === 'function'
            ? [BigInt64Array, BigUint64Array]
            /* c8 ignore next */
            : [])
    ].forEach((TypedArray) => create(TypedArray));
}

export default typedArrays;
