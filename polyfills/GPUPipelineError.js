/**
 * @typedef {{reason: "internal"|"validation"}} GPUPipelineErrorInit
 */
/**
 * GPUPipelineError polyfill (not yet available in Node/jsdom).
 */
class GPUPipelineError extends DOMException {
    /**
     * @param {string} message
     * @param {GPUPipelineErrorInit} init
     */
    constructor (message, {reason}) {
        super(
            message, 'GPUPipelineError'
        );

        if (reason !== 'internal' && reason !== 'validation') {
            throw new TypeError(
                '`reason` must be either "internal" or "validation".'
            );
        }
        this._reason = reason;
    }

    /**
     * @returns {"internal"|"validation"}
     */
    get reason () {
        return this._reason;
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'GPUPipelineError';
    }
}

export {GPUPipelineError};
