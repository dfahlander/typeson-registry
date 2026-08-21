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
            return new EncodedVideoChunk({
                type, timestamp, duration, data: new Uint8Array(data)
            });
        }
    }
};

export default encodedvideochunk;
