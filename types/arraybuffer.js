import {toStringTag} from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const arraybuffer = {
    arraybuffer: {
        test (x) { return toStringTag(x) === 'ArrayBuffer'; },
        replace (
            b,
            /**
             * @type {import('typeson').StateObject &
             *   {buffers?: ArrayBuffer[]}}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(b);
            if (index > -1) {
                return {index};
            }
            stateObj.buffers.push(b);
            return {
                s: encode(b),
                maxByteLength: b.maxByteLength
            };
        },
        revive (
            b64,
            /**
             * @type {import('typeson').StateObject &
             *   {buffers?: ArrayBuffer[]}}
             */
            stateObj
        ) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            if (Object.hasOwn(b64, 'index')) {
                return stateObj.buffers[
                    /**
                     * @type {{index: import('typeson').Integer}}
                     */
                    (b64).index
                ];
            }
            const buffer = decode(
                /** @type {string} */ (b64.s),
                {maxByteLength: b64.maxByteLength}
            );
            stateObj.buffers.push(buffer);
            return buffer;
        }
    }
};

export default arraybuffer;

// See also typed-arrays!
