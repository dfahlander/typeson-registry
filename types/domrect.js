/* globals DOMRect */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const domrect = {
    domrect: {
        test (x) { return toStringTag(x) === 'DOMRect'; },
        replace (dr) {
            return {
                x: dr.x,
                y: dr.y,
                width: dr.width,
                height: dr.height
            };
        },
        revive ({x, y, width, height}) {
            return new DOMRect(x, y, width, height);
        }
    }
};

export default domrect;
