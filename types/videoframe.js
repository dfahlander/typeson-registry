/* globals VideoFrame -- Polyfills */
import {TypesonPromise, toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const videoframe = {
    videoframe: {
        test (x) {
            return toStringTag(x) === 'VideoFrame';
        },
        replaceAsync (frame) {
            return new TypesonPromise(async (resolve, reject) => {
                try {
                    const {
                        format, codedWidth, codedHeight, timestamp, duration,
                        visibleRect, displayWidth, displayHeight, colorSpace
                    } = frame;

                    const data = new ArrayBuffer(frame.allocationSize());
                    await frame.copyTo(data);

                    resolve({
                        format, codedWidth, codedHeight, timestamp, duration,
                        visibleRect: {
                            x: visibleRect.x,
                            y: visibleRect.y,
                            width: visibleRect.width,
                            height: visibleRect.height
                        },
                        displayWidth, displayHeight,
                        colorSpace: {
                            primaries: colorSpace.primaries,
                            transfer: colorSpace.transfer,
                            matrix: colorSpace.matrix,
                            fullRange: colorSpace.fullRange
                        },
                        data
                    });
                /* c8 ignore next 3 -- How to simulate? */
                } catch (err) {
                    reject(err);
                }
            });
        },
        revive ({
            format, codedWidth, codedHeight, timestamp, duration,
            visibleRect, displayWidth, displayHeight, colorSpace, data
        }) {
            // A browser's `VideoFrameBufferInit` has no `duration` default
            //   and coerces an explicit `null`/`undefined` to `0`, so only
            //   pass it through when the source frame actually had one
            //   (otherwise `duration` must round-trip as `null`).
            /** @type {VideoFrameBufferInit} */
            const init = {
                format, codedWidth, codedHeight, timestamp,
                visibleRect, displayWidth, displayHeight, colorSpace
            };
            if (duration !== null && duration !== undefined) {
                init.duration = duration;
            }
            return new VideoFrame(new Uint8Array(data), init);
        }
    }
};

export default videoframe;
