/* eslint-env node */

import path from 'node:path';
import {webcrypto} from 'node:crypto';

import jsdom from 'jsdom';
import canvas from 'canvas';

const __dirname = path.resolve(path.dirname(decodeURI(
    new URL(import.meta.url).pathname
)));

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
globalThis.HTMLElement = globalThis.window.HTMLElement; // https://github.com/chaijs/type-detect/issues/98

// This should be made available automatically by jsdom: https://github.com/jsdom/jsdom/issues/1749
globalThis.ImageData = /** @type {NodeMockAPI} */ (canvas.ImageData);

// https://github.com/Automattic/node-canvas/issues/1646
Object.defineProperty(globalThis.ImageData.prototype, Symbol.toStringTag, {
    get () {
        return 'ImageData';
    }
});

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
globalThis.performance = window.performance;

globalThis.crypto = /** @type {NodeMockAPI} */ (webcrypto);

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876

/* eslint-disable no-extra-parens -- For TS */
/**
 * @param {HTMLCanvasElement} cvs
 * @returns {Promise<HTMLCanvasElement>}
 */
globalThis.createImageBitmap = /** @type {createImageBitmap} */ (
    function (
        /** @type {ImageBitmapSource & {dataset: {toStringTag?: string}}} */
        cvs
    ) {
        // eslint-disable-next-line promise/avoid-new
        return new Promise(function (resolve, reject) {
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
/* eslint-enable no-extra-parens -- For TS */

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

await import('./FileList.js');

export const imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');
