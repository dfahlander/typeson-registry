/* globals DOMPoint, DOMPointReadOnly */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const dompoint = {};

/* c8 ignore next */
if (typeof DOMPoint !== 'undefined') {
    create(DOMPoint);
}
/* c8 ignore next */
if (typeof DOMPointReadOnly !== 'undefined') {
    create(DOMPointReadOnly);
}

/**
 * @param {typeof DOMPoint|typeof DOMPointReadOnly} Ctor
 * @returns {void}
 */
function create (Ctor) {
    dompoint[Ctor.name.toLowerCase()] = {
        test (x) { return toStringTag(x) === Ctor.name; },
        replace (dp) {
            return {
                x: dp.x,
                y: dp.y,
                z: dp.z,
                w: dp.w
            };
        },
        revive ({x, y, z, w}) {
            return new Ctor(x, y, z, w);
        }
    };
}

export default dompoint;
