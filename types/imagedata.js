/** ImageData is browser / DOM specific (though `node-canvas` has it available on `Canvas`).
*/
import Typeson from 'typeson';
export default {
    imagedata: {
        test (x) { return Typeson.toStringTag(x) === 'ImageData'; },
        replace (d) {
            return {
                array: Array.from(d.data), // Ensure `length` gets preserved for revival
                width: d.width,
                height: d.height
            };
        },
        revive (o) {
            return new ImageData(new Uint8ClampedArray(o.array), o.width, o.height);
        }
    }
};
