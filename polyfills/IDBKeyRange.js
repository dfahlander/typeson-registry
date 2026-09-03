/**
 * For a full polyfill, use the likes of `indexeddbshim`
 */
class IDBKeyRange {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @param {IDBValidKey} lower
     * @param {IDBValidKey} upper
     * @param {boolean} lowerOpen
     * @param {boolean} upperOpen
     * @returns {IDBKeyRange}
     */
    static bound (lower, upper, lowerOpen, upperOpen) {
        return new IDBKeyRange(
            lower, upper, lowerOpen, upperOpen
        );
    }

    /**
     * Not the actual signature.
     * @param {IDBValidKey} lower
     * @param {IDBValidKey} upper
     * @param {boolean} lowerOpen
     * @param {boolean} upperOpen
     */
    constructor (lower, upper, lowerOpen, upperOpen) {
        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = lowerOpen;
        this.upperOpen = upperOpen;
    }

    /**
     * @returns {"IDBKeyRange"}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'IDBKeyRange';
    }
}

export {IDBKeyRange};
