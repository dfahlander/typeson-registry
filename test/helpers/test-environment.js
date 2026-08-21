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
    createImageBitmap,

    // URL
    createObjectURL,
    revokeObjectURL,
    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} from '../../polyfills/index.js';

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

globalThis.OffscreenCanvas = window.OffscreenCanvas;

globalThis.createImageBitmap = createImageBitmap;

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
