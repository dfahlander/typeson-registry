/* globals DOMPoint */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const dompoint = {
    dompoint: {
        test (x) { return toStringTag(x) === 'DOMPoint'; },
        replace (dp) {
            return {
                x: dp.x,
                y: dp.y,
                z: dp.z,
                w: dp.w
            };
        },
        revive ({x, y, z, w}) {
            return new DOMPoint(x, y, z, w);
        }
    }
};

export default dompoint;
