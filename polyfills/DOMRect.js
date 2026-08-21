// No constructor in JSDom
// globalThis.DOMRect = window.DOMRect;
/**
 * DOMRect class.
 */
class DOMRect {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor (x, y, width, height) {
        this.x = this.left = x;
        this.y = this.top = y;
        this.width = width;
        this.height = height;
        this.bottom = y + height;
        this.right = x + width;
    }
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMRect';
    }
}

export {DOMRect};
