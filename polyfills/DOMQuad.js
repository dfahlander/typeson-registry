import {DOMPoint} from './DOMPoint.js';

// No constructor in JSDom
// globalThis.DOMQuad = window.DOMQuad;
/**
 * DOMQuad class.
 */
class DOMQuad {
    /**
     * @param {DOMPoint} p1
     * @param {DOMPoint} p2
     * @param {DOMPoint} p3
     * @param {DOMPoint} p4
     */
    constructor (p1, p2, p3, p4) {
        this.p1 = p1 ?? new DOMPoint(0, 0, 0, 1);
        this.p2 = p2 ?? new DOMPoint(0, 0, 0, 1);
        this.p3 = p3 ?? new DOMPoint(0, 0, 0, 1);
        this.p4 = p4 ?? new DOMPoint(0, 0, 0, 1);
    }
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMQuad';
    }
}

export {DOMQuad};
