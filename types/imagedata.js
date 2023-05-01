/* globals ImageData */
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
            return {
                // Ensure `length` gets preserved for revival
                array: [...d.data],
                width: d.width,
                height: d.height
            };
        },
        revive (o) {
            return new ImageData(
                new Uint8ClampedArray(o.array), o.width, o.height
            );
        }
    }
};

export default imagedata;
