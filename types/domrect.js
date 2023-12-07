/* globals DOMRect, DOMRectReadOnly */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const domrect = {};

/* c8 ignore next */
if (typeof DOMRect !== 'undefined') {
    create(DOMRect);
}
/* c8 ignore next */
if (typeof DOMRectReadOnly !== 'undefined') {
    create(DOMRectReadOnly);
}

/**
 * @param {typeof DOMRect|typeof DOMRectReadOnly} Ctor
 * @returns {void}
 */
function create (Ctor) {
    domrect[Ctor.name.toLowerCase()] = {
        test (x) { return toStringTag(x) === Ctor.name; },
        replace (dr) {
            return {
                x: dr.x,
                y: dr.y,
                width: dr.width,
                height: dr.height
            };
        },
        revive ({x, y, width, height}) {
            return new Ctor(x, y, width, height);
        }
    };
}

export default domrect;
