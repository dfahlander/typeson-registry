/* globals window -- Polyfills */
/* eslint-disable unicorn/prefer-global-this,
  n/no-unsupported-features/node-builtins -- Polyfill */
/* eslint-disable
    unicorn/no-global-object-property-assignment -- HTML polyglot */

import path from 'node:path';
import {webcrypto} from 'node:crypto';

import jsdom from 'jsdom';
import * as canvas from 'canvas';
import {create, globals} from 'webgpu';

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

    buildCanvasPolyfills,
    buildFileList,
    buildWebgpu,

    // URL
    createObjectURL,
    revokeObjectURL,
    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} from '../../polyfills/index.js';

import '@formatjs/intl-durationformat/polyfill.js';

// eslint-disable-next-line unicorn/no-top-level-side-effects -- Ok
buildWebgpu({create, globals});

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

// @ts-expect-error -- Incomplete
globalThis.FileList = buildFileList(globalThis.HTMLInputElement);

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
    // Node < 20
    globalThis.crypto = /** @type {NodeMockAPI} */ (webcrypto);
} catch {}

// `canvas` (https://github.com/Automattic/node-canvas) provides the actual
//   pixel-buffer backing for our `ImageBitmap`/`OffscreenCanvas`/
//   `createImageBitmap` polyfills; it is supplied here (a devDependency of
//   this repo) rather than being a dependency of the polyfills themselves,
//   so consumers of `../../polyfills` are never forced onto a particular
//   `canvas` version: https://github.com/Automattic/node-canvas/issues/876
const {
    ImageBitmap,
    OffscreenCanvas,
    createImageBitmap
} = buildCanvasPolyfills(canvas);

if (!globalThis.ImageBitmap) {
    globalThis.ImageBitmap = ImageBitmap;
}

globalThis.OffscreenCanvas = window.OffscreenCanvas ?? OffscreenCanvas;

if (!globalThis.createImageBitmap) {
    globalThis.createImageBitmap = createImageBitmap;
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

export const imageTestFileNode = 'file://' + path.resolve(import.meta.dirname, 'Flag_of_the_United_Nations.png');
