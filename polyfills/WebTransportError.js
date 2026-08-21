/**
 * WebTransportError polyfill (not yet available in Node/jsdom).
 */
class WebTransportError extends DOMException {
    /**
     * @param {{
     *   message?: string,
     *   source?: "stream"|"session",
     *   streamErrorCode?: number|null
     * }} [init]
     */
    constructor ({
        message = '', source = 'stream', streamErrorCode = null
    } = {}) {
        super(message, 'WebTransportError');
        this._source = source;
        this._streamErrorCode = streamErrorCode;
    }

    /**
     * @returns {"stream"|"session"}
     */
    get source () {
        return this._source;
    }

    /**
     * @returns {number|null}
     */
    get streamErrorCode () {
        return this._streamErrorCode;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'WebTransportError';
    }
}

export {WebTransportError};
