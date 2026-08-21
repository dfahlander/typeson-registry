// No constructor in JSDom
// globalThis.DOMPointReadOnly = window.DOMPointReadOnly;
/**
 * DOMPointReadOnly class.
 */
class DOMPointReadOnly {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     */
    constructor (x, y, z, w) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
        this.w = w ?? 1;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMPointReadOnly';
    }
}

export {DOMPointReadOnly};
