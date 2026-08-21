/* eslint-disable no-shadow -- Polyfill */
/**
 * QuotaExceededError polyfill (not yet available in Node/jsdom).
 */
class QuotaExceededError extends DOMException {
    /* eslint-enable no-shadow -- Polyfill */
    /**
     * @param {string} [message]
     * @param {{quota?: number, requested?: number}} [options]
     */
    constructor (message = '', {quota, requested} = {}) {
        super(message, 'QuotaExceededError');
        this._quota = quota === undefined ? null : quota;
        this._requested = requested === undefined ? null : requested;
        if (this._quota !== null && this._quota < 0) {
            throw new RangeError('quota must not be negative');
        }
        if (this._requested !== null && this._requested < 0) {
            throw new RangeError('requested must not be negative');
        }
        if (
            this._quota !== null && this._requested !== null &&
            this._requested < this._quota
        ) {
            throw new RangeError('requested must not be less than quota');
        }
    }

    /**
     * @returns {number|null}
     */
    get quota () {
        return this._quota;
    }

    /**
     * @returns {number|null}
     */
    get requested () {
        return this._requested;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'QuotaExceededError';
    }
}

export {QuotaExceededError};
