/**
 * EncodedAudioChunk class.
 */
class EncodedAudioChunk {
    /**
     * @typedef {"key"|"delta"} EncodedAudioChunkType
     */

    /**
     * @param {{
     *   type: EncodedAudioChunkType,
     *   timestamp: number,
     *   duration?: number,
     *   data: ArrayBufferView|ArrayBuffer
     * }} init
     */
    constructor ({type, timestamp, duration, data}) {
        if (type !== 'key' && type !== 'delta') {
            throw new TypeError(`Unsupported EncodedAudioChunk type: ${type}`);
        }

        this.type = type;
        this.timestamp = timestamp;
        this.duration = duration ?? null;

        this._data = ArrayBuffer.isView(data)
            ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
            : new Uint8Array(data);
    }

    /**
     * @returns {number}
     */
    get byteLength () {
        return this._data.byteLength;
    }

    /**
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @returns {void}
     */
    copyTo (destination) {
        const destIsView = ArrayBuffer.isView(destination);
        const targetBuffer = /** @type {ArrayBuffer} */ (
            destIsView ? destination.buffer : destination
        );
        const targetByteOffset = destIsView ? destination.byteOffset : 0;
        const targetByteLength = destination.byteLength;

        if (targetByteLength < this._data.byteLength) {
            // Browsers throw a `TypeError` (not a `RangeError`) here.
            throw new TypeError(
                `Destination buffer is too small. Need ${
                    this._data.byteLength
                } bytes, got ${targetByteLength}.`
            );
        }

        const destView = new Uint8Array(
            targetBuffer, targetByteOffset, this._data.byteLength
        );
        destView.set(this._data);
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'EncodedAudioChunk';
    }
}

export {EncodedAudioChunk};
