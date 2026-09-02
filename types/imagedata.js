/* globals ImageData -- Polyfills */
// `ImageData` is browser / DOM specific (though `node-canvas` has it
//   available on `Canvas`).

import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const imagedata = {
    imagedata: {
        test (x) { return toStringTag(x) === 'ImageData'; },
        replace (d) {
            const pixelFormat = toStringTag(d.data) === 'Float16Array'
                /* c8 ignore next -- Not yet supported in `canvas` */
                ? 'rgba-float16'
                : 'rgba-unorm8';
            return {
                // Ensure `length` gets preserved for revival
                array: [...d.data],
                width: d.width,
                height: d.height,
                pixelFormat,
                colorSpace: d.colorSpace
            };
        },
        revive (o) {
            const {array, width, height, colorSpace, pixelFormat} = o;
            /* c8 ignore next 12 -- Not yet supported in `canvas` */
            if (pixelFormat === 'rgba-float16') {
                return new ImageData(
                    // @ts-expect-error -- Ok
                    new Float16Array(array),
                    width,
                    height,
                    {
                        colorSpace,
                        pixelFormat
                    }
                );
            }
            return new ImageData(
                new Uint8ClampedArray(array), width, height, {
                    colorSpace,
                    pixelFormat
                }
            );
        }
    }
};

export default imagedata;
