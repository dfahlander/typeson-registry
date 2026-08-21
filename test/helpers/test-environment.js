/* globals window -- Polyfills */
/* eslint-disable unicorn/prefer-global-this,
  n/no-unsupported-features/node-builtins -- Polyfill */
/* eslint-disable
    unicorn/no-global-object-property-assignment --
    HTML polyglot */

import path from 'node:path';
import {webcrypto} from 'node:crypto';

import jsdom from 'jsdom';
import * as canvas from 'canvas';

const __dirname = import.meta.dirname;

const {JSDOM} = jsdom;

const dom = new JSDOM('', {
    // Needed to load an image file
    // https://github.com/jsdom/jsdom#loading-subresources
    resources: 'usable'
});

/**
 * @typedef {any} NodeMockAPI
 */

globalThis.document = dom.window.document;
globalThis.window = /** @type {NodeMockAPI} */ (dom.window);

// eslint-disable-next-line unicorn/no-unnecessary-global-this -- HTML polyglot
globalThis.HTMLElement = globalThis.window.HTMLElement; // https://github.com/chaijs/type-detect/issues/98

// This should be made available automatically by jsdom: https://github.com/jsdom/jsdom/issues/1749
globalThis.ImageData = /** @type {NodeMockAPI} */ (canvas.ImageData);

globalThis.FileReader = window.FileReader;
// Used by our test-environment `FileList` polyfill
globalThis.HTMLInputElement = window.HTMLInputElement;

globalThis.FileList = window.FileList;

/** @type {NodeMockAPI} */ (
    globalThis
).XMLHttpRequest = /** @type {NodeMockAPI} */ (
    dom.window.XMLHttpRequest
);

globalThis.URL = window.URL;
globalThis.location = window.location;

globalThis.Blob = window.Blob;
globalThis.File = window.File;
globalThis.DOMException = window.DOMException;

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
globalThis.QuotaExceededError = QuotaExceededError;

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
// @ts-expect-error - More recent API (single `init` argument)
globalThis.WebTransportError = WebTransportError;

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
// @ts-expect-error -- Ok
globalThis.AudioData = AudioData;


// No constructor in JSDom
// globalThis.DOMRect = window.DOMRect;
// globalThis.DOMRectReadOnly = window.DOMRectReadOnly;
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
// @ts-expect-error Not an issue
globalThis.DOMRect = DOMRect;

/**
 * DOMRectReadOnly class.
 */
class DOMRectReadOnly {
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
        return 'DOMRectReadOnly';
    }
}

// @ts-expect-error Not an issue
globalThis.DOMRectReadOnly = DOMRectReadOnly;

// No constructor in JSDom
// globalThis.DOMPoint = window.DOMPoint;
// globalThis.DOMPointReadOnly = window.DOMPointReadOnly;
/**
 * DOMPoint class.
 */
class DOMPoint {
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
        return 'DOMPoint';
    }
}
// @ts-expect-error Not an issue
globalThis.DOMPoint = DOMPoint;

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
// @ts-expect-error Not an issue
globalThis.DOMPointReadOnly = DOMPointReadOnly;

// No constructor in JSDom
// globalThis.DOMQuad = window.DOMQuad;
/**
 * DOMQuad class.
 */
class DOMQuad {
    /**
     * @param {DOMPoint} p1
     * @param {DOMPoint} p2
     * @param {DOMPoint} p3
     * @param {DOMPoint} p4
     */
    constructor (p1, p2, p3, p4) {
        this.p1 = p1 ?? new DOMPoint(0, 0, 0, 1);
        this.p2 = p2 ?? new DOMPoint(0, 0, 0, 1);
        this.p3 = p3 ?? new DOMPoint(0, 0, 0, 1);
        this.p4 = p4 ?? new DOMPoint(0, 0, 0, 1);
    }
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMQuad';
    }
}
// @ts-expect-error Not an issue
globalThis.DOMQuad = DOMQuad;

// No constructor in JSDom
// globalThis.DOMMatrix = window.DOMMatrix;
// globalThis.DOMMatrixReadOnly = window.DOMMatrixReadOnly;
/**
 * DOMMatrix class.
 */
class DOMMatrix {
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
        return 'DOMMatrix';
    }
}
// @ts-expect-error Not an issue
globalThis.DOMMatrix = DOMMatrix;

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
// @ts-expect-error Not an issue
globalThis.DOMMatrixReadOnly = DOMMatrixReadOnly;

try {
    // Before Node < 20
    globalThis.crypto = /** @type {NodeMockAPI} */ (webcrypto);
} catch {}

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876

globalThis.OffscreenCanvas = window.OffscreenCanvas;

/**
 * @param {HTMLCanvasElement} cvs
 * @returns {Promise<HTMLCanvasElement>}
 */
globalThis.createImageBitmap = /** @type {typeof createImageBitmap} */ (
    function (
        /** @type {ImageBitmapSource & {dataset: {toStringTag?: string}}} */
        cvs
    ) {
        // eslint-disable-next-line promise/avoid-new -- Polyfill
        return new Promise(function (resolve /* , reject */) {
            // This really ought not be a canvas, but it works as a simple shim
            //   for our tests
            // cvs[Symbol.toStringTag] = 'ImageBitmap';
            // Above line throwing in current jsdom now
            if (!cvs.dataset) {
                cvs.dataset = {};
            }
            cvs.dataset.toStringTag = 'ImageBitmap';
            resolve(/** @type {ImageBitmap} */ (cvs));
        });
    }
);

const {
    createObjectURL, revokeObjectURL,

    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} = await import('../../polyfills/createObjectURL.js');

if (!URL.createObjectURL) {
    // Does not work for the browser
    URL.createObjectURL = createObjectURL;
    globalThis.XMLHttpRequest.prototype.overrideMimeType =
        xmlHttpRequestOverrideMimeType();
}

if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = revokeObjectURL;
}

globalThis.xmlHttpRequestOverrideMimeType = xmlHttpRequestOverrideMimeType;

// eslint-disable-next-line unicorn/no-top-level-side-effects -- Ok
await import('./FileList.js');

export const imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');
