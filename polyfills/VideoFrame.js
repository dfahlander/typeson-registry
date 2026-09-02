// Per-plane subsampling factors (relative to `codedWidth`/`codedHeight`)
//   and bytes per sample, keyed by `VideoPixelFormat`. Planes are assumed
//   to be stored tightly packed and back-to-back within a single buffer,
//   in the order listed here.
const PIXEL_FORMATS = {
    I420: [
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // Y
        {xSub: 2, ySub: 2, bytesPerSample: 1}, // U
        {xSub: 2, ySub: 2, bytesPerSample: 1} // V
    ],
    I420A: [
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // Y
        {xSub: 2, ySub: 2, bytesPerSample: 1}, // U
        {xSub: 2, ySub: 2, bytesPerSample: 1}, // V
        {xSub: 1, ySub: 1, bytesPerSample: 1} // A
    ],
    I422: [
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // Y
        {xSub: 2, ySub: 1, bytesPerSample: 1}, // U
        {xSub: 2, ySub: 1, bytesPerSample: 1} // V
    ],
    I444: [
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // Y
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // U
        {xSub: 1, ySub: 1, bytesPerSample: 1} // V
    ],
    NV12: [
        {xSub: 1, ySub: 1, bytesPerSample: 1}, // Y
        {xSub: 2, ySub: 2, bytesPerSample: 2} // Interleaved UV
    ],
    RGBA: [{xSub: 1, ySub: 1, bytesPerSample: 4}],
    RGBX: [{xSub: 1, ySub: 1, bytesPerSample: 4}],
    BGRA: [{xSub: 1, ySub: 1, bytesPerSample: 4}],
    BGRX: [{xSub: 1, ySub: 1, bytesPerSample: 4}]
};

// `VideoPixelFormat`s that carry red/green/blue channels (an "RGB
//   format" per the WebCodecs spec). Used to pick the default
//   `colorSpace` when the caller does not supply one.
const RGB_FORMATS = new Set(['RGBA', 'RGBX', 'BGRA', 'BGRX']);

/**
 * VideoFrame class.
 *
 * Note: Unlike the spec, this polyfill only supports construction from
 *   a raw pixel buffer (`VideoFrameBufferInit`); constructing from a
 *   `CanvasImageSource` is not supported as there is no such source of
 *   pixels available by default in Node. `copyTo`/`allocationSize` also
 *   always treat the source data as tightly packed at `codedWidth` x
 *   `codedHeight` (i.e. a custom `layout` is not supported).
 */
class VideoFrame {
    /**
     * @typedef {"BGRA"|"BGRX"|"I420"|"I420A"|"I422"|"I444"|"NV12"|"RGBA"
     *   |"RGBX"} VideoPixelFormat
     */

    /**
     * @typedef {{
     *   x: number, y: number, width: number, height: number
     * }} VideoFrameRect
     */

    /** @type {Uint8Array|undefined} */
    #data;

    /** @type {boolean} */
    #closed;

    /** @type {VideoPixelFormat|null} */
    format;

    /** @type {number} */
    codedWidth;

    /** @type {number} */
    codedHeight;

    /** @type {VideoFrameRect|null} */
    codedRect;

    /** @type {number} */
    timestamp;

    /** @type {number|null} */
    duration;

    /** @type {VideoFrameRect|null} */
    visibleRect;

    /** @type {number} */
    displayWidth;

    /** @type {number} */
    displayHeight;

    /**
     * @type {{
     *   primaries: string|null, transfer: string|null,
     *   matrix: string|null, fullRange: boolean|null
     * }}
     */
    colorSpace;

    /**
     * @param {ArrayBufferView|ArrayBuffer} data
     * @param {{
     *   format: VideoPixelFormat,
     *   codedWidth: number,
     *   codedHeight: number,
     *   timestamp: number,
     *   duration?: number|null,
     *   visibleRect?: VideoFrameRect,
     *   displayWidth?: number,
     *   displayHeight?: number,
     *   colorSpace?: {
     *     primaries: string|null,
     *     transfer: string|null,
     *     matrix: string|null,
     *     fullRange: boolean|null
     *   }
     * }} init
     */
    constructor (data, {
        format, codedWidth, codedHeight, timestamp, duration,
        visibleRect, displayWidth, displayHeight, colorSpace
    }) {
        if (!Object.hasOwn(PIXEL_FORMATS, format)) {
            throw new TypeError(`Unsupported video pixel format: ${format}`);
        }

        this.format = format;
        this.codedWidth = codedWidth;
        this.codedHeight = codedHeight;
        this.codedRect = {x: 0, y: 0, width: codedWidth, height: codedHeight};
        this.timestamp = timestamp;
        this.duration = duration ?? null;

        this.visibleRect = visibleRect
            ? {
                x: visibleRect.x,
                y: visibleRect.y,
                width: visibleRect.width,
                height: visibleRect.height
            }
            : {x: 0, y: 0, width: codedWidth, height: codedHeight};

        this.displayWidth = displayWidth ?? this.visibleRect.width;
        this.displayHeight = displayHeight ?? this.visibleRect.height;

        // Per the spec's "Pick Color Space" algorithm: an explicit
        //   `colorSpace` is used as given; otherwise the frame defaults
        //   to the sRGB color space for RGB pixel formats and to REC709
        //   for all others.
        if (colorSpace) {
            this.colorSpace = {
                primaries: colorSpace.primaries,
                transfer: colorSpace.transfer,
                matrix: colorSpace.matrix,
                fullRange: colorSpace.fullRange
            };
        } else if (RGB_FORMATS.has(format)) {
            this.colorSpace = {
                primaries: 'bt709', transfer: 'iec61966-2-1',
                matrix: 'rgb', fullRange: true
            };
        } else {
            this.colorSpace = {
                primaries: 'bt709', transfer: 'bt709',
                matrix: 'bt709', fullRange: false
            };
        }

        this.#data = ArrayBuffer.isView(data)
            ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
            : new Uint8Array(data);

        this.#closed = false;
    }

    /**
     * @returns {void}
     */
    #checkNotClosed () {
        if (this.#closed) {
            throw new DOMException(
                'VideoFrame is closed', 'InvalidStateError'
            );
        }
    }

    /**
     * Computes, for the (cropped) region of interest, the byte layout of
     *   each plane both within our tightly packed source data and within
     *   a tightly packed destination buffer.
     * @param {{
     *   rect?: {x: number, y: number, width: number, height: number},
     *   format?: VideoPixelFormat
     * }} options
     * @returns {{
     *   planes: {
     *     srcPlaneOffset: number, srcStride: number,
     *     srcRowStart: number, srcRowStartY: number,
     *     planeWidth: number, planeHeight: number, bytesPerSample: number,
     *     stride: number, offset: number
     *   }[],
     *   layout: {offset: number, stride: number}[],
     *   totalSize: number
     * }}
     */
    #layout (options) {
        if (options.format && options.format !== this.format) {
            // Browsers reject an unsupported pixel-format conversion with
            //   a `NotSupportedError` `DOMException`.
            throw new DOMException(
                'VideoFrame polyfill does not support pixel format conversion',
                'NotSupportedError'
            );
        }

        // Only reached while open (callers always call `#checkNotClosed`
        //   first), so `format`/`visibleRect` are known non-null here.
        const {format: rawFormat, visibleRect: rawVisibleRect} = this;
        const format = /** @type {VideoPixelFormat} */ (rawFormat);
        const rect = options.rect ||
        /** @type {VideoFrameRect} */ (rawVisibleRect);
        const specs = PIXEL_FORMATS[format];

        let srcOffset = 0;
        const srcPlaneOffsets = specs.map(({xSub, ySub, bytesPerSample}) => {
            const planeOffset = srcOffset;
            srcOffset += Math.ceil(this.codedWidth / xSub) *
                Math.ceil(this.codedHeight / ySub) * bytesPerSample;
            return planeOffset;
        });

        let destOffset = 0;
        const planes = specs.map(({xSub, ySub, bytesPerSample}, i) => {
            const planeWidth = Math.ceil(rect.width / xSub);
            const planeHeight = Math.ceil(rect.height / ySub);
            const stride = planeWidth * bytesPerSample;
            const offset = destOffset;
            destOffset += stride * planeHeight;
            return {
                srcPlaneOffset: srcPlaneOffsets[i],
                srcStride: Math.ceil(this.codedWidth / xSub) * bytesPerSample,
                srcRowStart: Math.floor(rect.x / xSub) * bytesPerSample,
                srcRowStartY: Math.floor(rect.y / ySub),
                planeWidth, planeHeight, bytesPerSample, stride, offset
            };
        });

        return {
            planes,
            layout: planes.map(({offset, stride}) => ({offset, stride})),
            totalSize: destOffset
        };
    }

    /**
     * @param {{
     *   rect?: {x: number, y: number, width: number, height: number},
     *   format?: VideoPixelFormat
     * }} [options]
     * @returns {number}
     */
    allocationSize (options = {}) {
        this.#checkNotClosed();
        return this.#layout(options).totalSize;
    }

    /**
     * @param {ArrayBufferView|ArrayBuffer} destination
     * @param {{
     *   rect?: {x: number, y: number, width: number, height: number},
     *   format?: VideoPixelFormat
     * }} [options]
     * @returns {Promise<{offset: number, stride: number}[]>}
     */
    copyTo (destination, options = {}) {
        this.#checkNotClosed();
        const {planes, layout, totalSize} = this.#layout(options);
        const data = /** @type {Uint8Array} */ (this.#data);

        const destIsView = ArrayBuffer.isView(destination);
        const targetBuffer = /** @type {ArrayBuffer} */ (
            destIsView ? destination.buffer : destination
        );
        const targetByteOffset = destIsView ? destination.byteOffset : 0;
        const targetByteLength = destination.byteLength;

        if (targetByteLength < totalSize) {
            // Browsers reject with a `TypeError` (not a `RangeError`) here.
            throw new TypeError(
                `Destination buffer is too small. Need ${
                    totalSize
                } bytes, got ${targetByteLength}.`
            );
        }

        const destBytes = new Uint8Array(
            targetBuffer, targetByteOffset, totalSize
        );

        for (const plane of planes) {
            const {
                srcPlaneOffset, srcStride, srcRowStart, srcRowStartY,
                planeWidth, planeHeight, bytesPerSample, stride, offset
            } = plane;
            const rowBytes = planeWidth * bytesPerSample;
            for (let row = 0; row < planeHeight; row++) {
                const srcStart = srcPlaneOffset +
                    ((srcRowStartY + row) * srcStride) + srcRowStart;
                destBytes.set(
                    data.subarray(srcStart, srcStart + rowBytes),
                    offset + (row * stride)
                );
            }
        }

        return Promise.resolve(layout);
    }

    /**
     * @returns {VideoFrame}
     */
    clone () {
        this.#checkNotClosed();
        const data = /** @type {Uint8Array} */ (this.#data);
        return new VideoFrame(data.slice(), {
            format: /** @type {VideoPixelFormat} */ (this.format),
            codedWidth: this.codedWidth,
            codedHeight: this.codedHeight,
            timestamp: this.timestamp,
            duration: this.duration,
            visibleRect: /** @type {VideoFrameRect} */ (this.visibleRect),
            displayWidth: this.displayWidth,
            displayHeight: this.displayHeight,
            colorSpace: this.colorSpace
        });
    }

    /**
     * @returns {void}
     */
    close () {
        this.#closed = true;
        this.#data = undefined;
        this.format = null;
        this.codedWidth = 0;
        this.codedHeight = 0;
        this.codedRect = null;
        this.visibleRect = null;
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.duration = null;
        this.timestamp = 0;
        this.colorSpace = {
            primaries: null, transfer: null, matrix: null, fullRange: null
        };
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'VideoFrame';
    }
}

export {VideoFrame};
