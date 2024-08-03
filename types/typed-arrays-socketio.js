import {toStringTag} from 'typeson';

// Support all kinds of typed arrays (views of ArrayBuffers)

/**
 * @type {import('typeson').TypeSpecSet}
 */
const typedArraysSocketIO = {};

/**
 * @param {Int8ArrayConstructor|Uint8ArrayConstructor|
 *   Uint8ClampedArrayConstructor|Int16ArrayConstructor|
 *   Uint16ArrayConstructor|Int32ArrayConstructor|
 *   Uint32ArrayConstructor|Float32ArrayConstructor|
 *   Float64ArrayConstructor|
 *   BigInt64ArrayConstructor|BigUint64ArrayConstructor
 * } TypedArray
 * @returns {void}
 */
function create (TypedArray) {
    const typeName = TypedArray.name;
    typedArraysSocketIO[typeName.toLowerCase()] = {
        test (x) { return toStringTag(x) === typeName; },
        replace (a) {
            return (a.byteOffset === 0 &&
                a.byteLength === a.buffer.byteLength
                ? a
                // socket.io supports streaming ArrayBuffers.
                // If we have a typed array representing a portion
                //   of the buffer, we need to clone
                //   the buffer before leaving it to socket.io.
                : a.slice(0)).buffer;
        },
        revive (buf) {
            // One may configure socket.io to revive binary data as
            //    Buffer or Blob.
            // We should therefore not rely on that the instance we
            //   get here is an ArrayBuffer
            // If not, let's assume user wants to receive it as
            //   configured with socket.io.
            return toStringTag(buf) === 'ArrayBuffer'
                ? new TypedArray(buf)
                : buf;
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

export default typedArraysSocketIO;
