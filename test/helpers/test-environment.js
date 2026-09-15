/* globals window -- Polyfills */
/* eslint-disable unicorn/prefer-global-this,
  n/no-unsupported-features/node-builtins -- Polyfill */
/* eslint-disable
    unicorn/no-global-object-property-assignment -- HTML polyglot */

import path from 'node:path';
import {webcrypto} from 'node:crypto';

import jsdom from 'jsdom';
import * as canvas from 'canvas';

import {
    // eslint-disable-next-line no-shadow -- Polyfill
    QuotaExceededError,
    WebTransportError,
    AudioData,
    EncodedAudioChunk,
    EncodedVideoChunk,
    VideoFrame,
    DOMRect,
    DOMRectReadOnly,
    DOMPoint,
    DOMPointReadOnly,
    DOMQuad,
    DOMMatrix,
    DOMMatrixReadOnly,
    IDBKeyRange,

    createImageBitmap as createImageBitmapPolyfill,

    // URL
    createObjectURL,
    revokeObjectURL,
    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} from '../../polyfills/index.js';

import '@formatjs/intl-durationformat/polyfill.js';

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

// @ts-expect-error -- Incomplete
globalThis.IDBKeyRange = IDBKeyRange;

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


globalThis.QuotaExceededError = QuotaExceededError;

// @ts-expect-error - More recent API (single `init` argument)
globalThis.WebTransportError = WebTransportError;

// @ts-expect-error -- Ok
globalThis.AudioData = AudioData;

// @ts-expect-error -- Ok
globalThis.EncodedAudioChunk = EncodedAudioChunk;

// @ts-expect-error -- Ok
globalThis.EncodedVideoChunk = EncodedVideoChunk;

// @ts-expect-error -- Ok
globalThis.VideoFrame = VideoFrame;

// @ts-expect-error Not an issue
globalThis.DOMRect = DOMRect;

// @ts-expect-error Not an issue
globalThis.DOMRectReadOnly = DOMRectReadOnly;

// @ts-expect-error Not an issue
globalThis.DOMPoint = DOMPoint;

// @ts-expect-error Not an issue
globalThis.DOMPointReadOnly = DOMPointReadOnly;

// @ts-expect-error Not an issue
globalThis.DOMQuad = DOMQuad;

// @ts-expect-error Not an issue
globalThis.DOMMatrix = DOMMatrix;

// @ts-expect-error Not an issue
globalThis.DOMMatrixReadOnly = DOMMatrixReadOnly;

try {
    // Before Node < 20
    globalThis.crypto = /** @type {NodeMockAPI} */ (webcrypto);
} catch {}

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876

// @ts-expect-error -- Testing
globalThis.createImageBitmapPolyfill = createImageBitmapPolyfill;

/**
 *
 */
class ImageBitmap extends canvas.Image {
    [Symbol.toStringTag] = 'ImageBitmap';

    /**
     * @returns {void}
     */
    close () {
        this.src = '';
        this.width = 0;
        this.height = 0;
    }
}
globalThis.OffscreenCanvas = window.OffscreenCanvas ??
    /**
     *
     */
    class OffscreenCanvas {
        [Symbol.toStringTag] = 'OffscreenCanvas';

        /**
         * @param {number} width
         * @param {number} height
         */
        constructor (width, height) {
            // Use node-canvas's headless Canvas instance
            this._canvas = new canvas.Canvas(width, height);
        }

        // Proxy the size properties
        /**
         * @returns {number}
         */
        get width () { return this._canvas.width; }
        // eslint-disable-next-line jsdoc/require-jsdoc -- Not allowed in TS
        set width (val) { this._canvas.width = val; }
        /**
         * @returns {number}
         */
        get height () { return this._canvas.height; }
        // eslint-disable-next-line jsdoc/require-jsdoc -- Not allowed in TS
        set height (val) { this._canvas.height = val; }

        // Mirror the standard getContext interface
        /**
         * @param {"2d"|"3d"} contextType
         * @param {canvas.
         *   NodeCanvasRenderingContext2DSettings} contextAttributes
         * @returns {canvas.CanvasRenderingContext2D}
         */
        getContext (contextType, contextAttributes) {
            if (contextType === '2d') {
                return this._canvas.getContext('2d', contextAttributes);
            }
            throw new Error(
                `Context type "${contextType}" is not polyfilled in Node.js.`
            );
        }

        /**
         * @returns {ImageBitmap}
         */
        transferToImageBitmap () {
            const bitmap = new ImageBitmap();

            // Convert the current canvas state to a synchronous buffer snapshot
            // and feed it directly to the ImageBitmap's source
            bitmap.src = this._canvas.toBuffer();

            // Mirror the explicit width/height dimensions
            bitmap.width = this.width;
            bitmap.height = this.height;

            return bitmap;
        }

        // Convert to standard Blob if needed by your frontend libraries
        /**
         * @param {{type?: string}} [options]
         * @returns {Promise<Blob>}
         */
        convertToBlob (options) {
            // eslint-disable-next-line promise/avoid-new -- Own API
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line promise/prefer-await-to-callbacks -- Own API
                this._canvas.toBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(
                        // @ts-expect-error Ok
                        new Blob([buffer], {type: options?.type || 'image/png'})
                    );
                });
            });
        }
    };

/**
 * Loads a source directly into an `ImageBitmap` instance (rather than a
 *   plain `canvas.Image`) so the result stays a real, drawable node-canvas
 *   image -- a plain object merely duck-typing `ImageBitmap`'s shape is
 *   rejected by jsdom's `CanvasRenderingContext2D#drawImage` ("Image or
 *   Canvas expected").
 * @param {string|Buffer} src
 * @returns {Promise<ImageBitmap>}
 */
// eslint-disable-next-line promise/avoid-new -- Own API
const loadAsImageBitmap = (src) => new Promise((resolve, reject) => {
    const bitmap = new ImageBitmap();
    // node-canvas's `Image` is not a DOM `EventTarget`, so it has no
    //   `addEventListener` -- only the classic `onload`/`onerror` callback
    //   properties.
    // eslint-disable-next-line unicorn/prefer-add-event-listener -- N/A
    bitmap.onload = () => resolve(bitmap);
    // eslint-disable-next-line unicorn/prefer-add-event-listener -- N/A
    bitmap.onerror = reject;
    bitmap.src = src;
});

if (!globalThis.createImageBitmap) {
    /**
     * @param {ImageBitmapSource} source
     * @returns {Promise<ImageBitmap>}
     */
    globalThis.createImageBitmap = async function (source) {
        // Handle Blob (or Blob-like) sources
        if (Object.prototype.toString.call(source) === '[object Blob]' ||
            (typeof source === 'object' && source !== null &&
                'arrayBuffer' in source)) {
            const blobLike = /** @type {Blob} */ (source);
            const ab = await blobLike.arrayBuffer();
            return await loadAsImageBitmap(Buffer.from(ab));
        }

        // Handle URL strings or standard paths/buffers directly
        if (typeof source === 'string' ||
            Object.prototype.toString.call(source) === '[object Buffer]') {
            return await loadAsImageBitmap(
                /** @type {string|Buffer} */ (/** @type {unknown} */ (source))
            );
        }

        // Handle canvas-like sources: a node-canvas `Canvas` (or our
        //   `OffscreenCanvas` polyfill's underlying canvas) exposes
        //   `toBuffer` directly, while jsdom's `HTMLCanvasElement` only
        //   exposes `toDataURL`
        if (typeof source === 'object' && source !== null &&
            'toBuffer' in source) {
            const canvasLike = /** @type {{toBuffer: () => Buffer}} */ (
                source
            );
            return await loadAsImageBitmap(canvasLike.toBuffer());
        }
        if (typeof source === 'object' && source !== null &&
            'toDataURL' in source) {
            const canvasLike = /** @type {{toDataURL: () => string}} */ (
                source
            );
            return await loadAsImageBitmap(canvasLike.toDataURL());
        }

        throw new Error(
            'Unsupported source type for createImageBitmap polyfill'
        );
    };
}

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

// eslint-disable-next-line @stylistic/max-len -- Long
// eslint-disable-next-line unicorn/no-top-level-side-effects -- Needed after `globalThis.HTMLInputElement`
await import('../../polyfills/FileList.js');

export const imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');
