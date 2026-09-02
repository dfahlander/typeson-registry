/* globals EncodedAudioChunk -- Polyfills */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const encodedaudiochunk = {
    encodedaudiochunk: {
        test (x) {
            return toStringTag(x) === 'EncodedAudioChunk';
        },
        replace (chunk) {
            const {type, timestamp, duration, byteLength} = chunk;
            const data = new ArrayBuffer(byteLength);
            chunk.copyTo(data);
            return {type, timestamp, duration, data};
        },
        revive ({type, timestamp, duration, data}) {
            // A browser's `EncodedAudioChunkInit` has no `duration`
            //   default and coerces an explicit `null`/`undefined` to `0`,
            //   so only pass it through when the source chunk actually
            //   had one (otherwise `duration` must round-trip as `null`).
            /** @type {EncodedAudioChunkInit} */
            const init = {type, timestamp, data: new Uint8Array(data)};
            if (duration !== null && duration !== undefined) {
                init.duration = duration;
            }
            return new EncodedAudioChunk(init);
        }
    }
};

export default encodedaudiochunk;
