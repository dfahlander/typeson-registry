/* globals EncodedVideoChunk -- Polyfills */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const encodedvideochunk = {
    encodedvideochunk: {
        test (x) {
            return toStringTag(x) === 'EncodedVideoChunk';
        },
        replace (chunk) {
            const {type, timestamp, duration, byteLength} = chunk;
            const data = new ArrayBuffer(byteLength);
            chunk.copyTo(data);
            return {type, timestamp, duration, data};
        },
        revive ({type, timestamp, duration, data}) {
            // A browser's `EncodedVideoChunkInit` has no `duration`
            //   default and coerces an explicit `null`/`undefined` to `0`,
            //   so only pass it through when the source chunk actually
            //   had one (otherwise `duration` must round-trip as `null`).
            /** @type {EncodedVideoChunkInit} */
            const init = {type, timestamp, data: new Uint8Array(data)};
            if (duration !== null && duration !== undefined) {
                init.duration = duration;
            }
            return new EncodedVideoChunk(init);
        }
    }
};

export default encodedvideochunk;
