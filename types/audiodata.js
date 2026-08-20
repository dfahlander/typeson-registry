/* globals AudioData -- Polyfills */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const audiodata = {
    audiodata: {
        test (x) {
            return toStringTag(x) === 'AudioData';
        },
        replace (audioData) {
            const {
                format, sampleRate, numberOfFrames, numberOfChannels,
                timestamp
            } = audioData;

            // 2. Determine plane layout based on audio format
            const isPlanar = format.endsWith('-planar');
            const numPlanes = isPlanar ? numberOfChannels : 1;

            // 3. Per the AudioData API, planes are laid out back-to-back
            //   within a single buffer, so compute their sizes up front
            const planeSizes = [];
            let totalSize = 0;
            for (let i = 0; i < numPlanes; i++) {
                const size = audioData.allocationSize({planeIndex: i});
                planeSizes.push(size);
                totalSize += size;
            }

            // 4. Copy the raw binary data out of each plane into its slot
            const data = new ArrayBuffer(totalSize);
            let offset = 0;
            for (let i = 0; i < numPlanes; i++) {
                const planeView = new Uint8Array(data, offset, planeSizes[i]);
                audioData.copyTo(planeView, {planeIndex: i});
                offset += planeSizes[i];
            }

            // 5. Return a clean, serializable manifest
            return {
                format, sampleRate, numberOfFrames, numberOfChannels,
                timestamp,
                data
            };
        },
        revive ({
            format, sampleRate, numberOfFrames, numberOfChannels,
            timestamp, data
        }) {
            return new AudioData({
                format, sampleRate, numberOfFrames, numberOfChannels,
                timestamp,
                data: new Uint8Array(data)
            });
        }
    }
};

export default audiodata;
