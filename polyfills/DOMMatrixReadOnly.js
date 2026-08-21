// No constructor in JSDom
// globalThis.DOMMatrixReadOnly = window.DOMMatrixReadOnly;
/**
 * DOMMatrixReadOnly class.
 */
class DOMMatrixReadOnly {
    /**
     * @param {[number, number, number, number, number, number]|
     *   [
     *     number, number, number, number,
     *     number, number, number, number,
     *     number, number, number, number,
     *     number, number, number, number
     * ]} init
     */
    constructor (init) {
        if (typeof init[6] !== 'number') {
            this.is2D = true;
            this.a = init[0];
            this.b = init[1];
            this.c = init[2];
            this.d = init[3];
            this.e = init[4];
            this.f = init[5];
            return;
        }
        this.is2D = false;
        this.m11 = init[0];
        this.m12 = init[1];
        this.m13 = init[2];
        this.m14 = init[3];
        this.m21 = init[4];
        this.m22 = init[5];
        this.m23 = init[6];
        this.m24 = init[7];
        this.m31 = init[8];
        this.m32 = init[9];
        this.m33 = init[10];
        this.m34 = init[11];
        this.m41 = init[12];
        this.m42 = init[13];
        this.m43 = init[14];
        this.m44 = init[15];
    }
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMMatrixReadOnly';
    }
}

export {DOMMatrixReadOnly};
