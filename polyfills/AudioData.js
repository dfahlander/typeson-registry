// Map format names to byte sizes and TypedArray constructors
const FORMAT_MAP = {
    u8: {bytesPerSample: 1, TypedArray: Uint8Array, isPlanar: false},
    s16: {bytesPerSample: 2, TypedArray: Int16Array, isPlanar: false},
    s32: {bytesPerSample: 4, TypedArray: Int32Array, isPlanar: false},
    f32: {bytesPerSample: 4, TypedArray: Float32Array, isPlanar: false},
    'u8-planar': {bytesPerSample: 1, TypedArray: Uint8Array, isPlanar: true},
    's16-planar': {bytesPerSample: 2, TypedArray: Int16Array, isPlanar: true},
    's32-planar': {bytesPerSample: 4, TypedArray: Int32Array, isPlanar: true},
    'f32-planar': {bytesPerSample: 4, TypedArray: Float32Array, isPlanar: true}
};

/**
 * AudioData class.
 */
class AudioData {
    /**
     * @typedef {"u8"|"s16"|"s32"|"f32"|"u8-planar"|"s16-planar"
     *   |"s32-planar"|"f32-planar"} AudioDataFormat
     */

    /**
     *
     * @param {{
     *   format: AudioDataFormat,
     *   sampleRate: number,
     *   numberOfChannels: number,
     *   numberOfFrames: number,
     *   timestamp: number,
     *   data: ArrayBufferView|ArrayBuffer
     * }} cfg
     */
    constructor ({
        format, sampleRate, numberOfChannels, numberOfFrames,
        timestamp = 0, data
    }) {
        if (!Object.hasOwn(FORMAT_MAP, format)) {
            throw new TypeError(`Unsupported audio format: ${format}`);
        }

        this.format = format;
        this.sampleRate = sampleRate;
        this.numberOfChannels = numberOfChannels;
        this.numberOfFrames = numberOfFrames;
        this.timestamp = timestamp;
        this.duration = numberOfFrames / sampleRate;

        const meta = FORMAT_MAP[format];
        this._bytesPerSample = meta.bytesPerSample;
        this._TypedArray = meta.TypedArray;
        this._isPlanar = Boolean(meta.isPlanar);

        // Per the AudioData API, `data` is a single buffer; for planar
        //   formats, each channel's plane is stored back-to-back within it.
        this._data = ArrayBuffer.isView(data)
            ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
            : new Uint8Array(data);
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'AudioData';
    }

    /**
     *
     * @param {{
     *   planeIndex?: number,
     *   frameCount?: number
     * }} [options]
     * @returns {number}
     */
    allocationSize (options = {}) {
        const planeIndex = options.planeIndex || 0;
        const frameCount = options.frameCount !== undefined
            ? options.frameCount
            : this.numberOfFrames;

        if (this._isPlanar) {
            if (planeIndex >= this.numberOfChannels) {
                throw new RangeError(
                    `planeIndex ${
                        planeIndex
                    } out of bounds for channel count ${this.numberOfChannels}`
                );
            }
            // Planar: One independent buffer per channel
            return frameCount * this._bytesPerSample;
        }
        if (planeIndex !== 0) {
            throw new RangeError(
                `Interleaved formats only have 1 plane (planeIndex 0)`
            );
        }
        // Interleaved: Channels multiplexed in one buffer
        return frameCount * this.numberOfChannels * this._bytesPerSample;
    }

    /**
     *
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @param {{
     *   planeIndex?: number,
     *   frameOffset?: number,
     *   frameCount?: number
     * }} [options]
     * @returns {void}
     */
    copyTo (destination, options = {}) {
        const planeIndex = options.planeIndex || 0;
        const frameOffset = options.frameOffset || 0;
        const frameCount = options.frameCount !== undefined
            ? options.frameCount
            : (this.numberOfFrames - frameOffset);

        if (frameOffset + frameCount > this.numberOfFrames) {
            throw new RangeError(
                'Requested frame offset or count exceeds ' +
                'total available frames.'
            );
        }

        // Explicitly target the ArrayBuffer underlying the incoming View
        //   (e.g. Node Buffer, Float32Array)
        const destIsView = ArrayBuffer.isView(destination);
        const targetBuffer = /** @type {ArrayBuffer} */ (
            destIsView ? destination.buffer : destination
        );
        const targetByteOffset = destIsView ? destination.byteOffset : 0;
        const targetByteLength = destination.byteLength;

        // Check size requirements matching standard layout sizes
        const requiredSize = this.allocationSize({planeIndex, frameCount});
        if (targetByteLength < requiredSize) {
            throw new RangeError(
                `Destination buffer is too small. Need ${
                    requiredSize
                } bytes, got ${targetByteLength}.`
            );
        }

        // Map a TypedArray overlay precisely onto the target buffer location
        const destElements = requiredSize / this._bytesPerSample;
        const destView = new this._TypedArray(
            targetBuffer, targetByteOffset, destElements
        );

        // Planar formats store each channel's plane back-to-back within
        //   `_data`; interleaved formats store one plane with samples
        //   multiplexed across channels.
        const chCount = this._isPlanar ? 1 : this.numberOfChannels;
        const planeByteOffset = this._isPlanar
            ? planeIndex * this.numberOfFrames * this._bytesPerSample
            : 0;
        const startElement = frameOffset * chCount;
        const elementCount = frameCount * chCount;
        const sourceByteOffset = planeByteOffset +
            (startElement * this._bytesPerSample);

        const sourceView = new this._TypedArray(
            /** @type {ArrayBuffer} */ (this._data.buffer),
            this._data.byteOffset + sourceByteOffset,
            elementCount
        );
        destView.set(sourceView);
    }
}

export {AudioData};
