/* globals DOMQuad */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const domquad = {
    domquad: {
        test (x) { return toStringTag(x) === 'DOMQuad'; },
        replace (dp) {
            return {
                p1: dp.p1,
                p2: dp.p2,
                p3: dp.p3,
                p4: dp.p4
            };
        },
        revive ({p1, p2, p3, p4}) {
            return new DOMQuad(p1, p2, p3, p4);
        }
    }
};

export default domquad;
