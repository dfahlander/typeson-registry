import {toStringTag} from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const dataview = {
    dataview: {
        test (x) { return toStringTag(x) === 'DataView'; },
        replace (
            {buffer, byteOffset, byteLength},
            /**
             * @type {import('typeson').StateObject & {
             *  buffers?: ArrayBuffer[]
             * }}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(buffer);
            if (index > -1) {
                return {index, byteOffset, byteLength};
            }
            stateObj.buffers.push(buffer);
            return {
                encoded: encode(buffer),
                maxByteLength: buffer.maxByteLength,
                resizable: buffer.resizable,
                byteOffset,
                byteLength
            };
        },
        revive (
            b64Obj,
            /**
             * @type {import('typeson').StateObject & {
             *  buffers?: ArrayBuffer[]
             * }}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const {
                byteOffset, byteLength, encoded, index, maxByteLength,
                resizable
            } = b64Obj;
            let buffer;
            if ('index' in b64Obj) {
                buffer = stateObj.buffers[index];
            } else {
                buffer = decode(
                    encoded,
                    // todo[engine:node@>20]: Remove comment
                    /* c8 ignore next 3 -- Depends on Node version */
                    resizable
                        ? {maxByteLength}
                        : maxByteLength
                );
                stateObj.buffers.push(buffer);
            }
            return new DataView(buffer, byteOffset, byteLength);
        }
    }
};

export default dataview;
