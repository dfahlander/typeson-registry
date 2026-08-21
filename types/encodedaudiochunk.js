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
            return new EncodedAudioChunk({
                type, timestamp, duration, data: new Uint8Array(data)
            });
        }
    }
};

export default encodedaudiochunk;
