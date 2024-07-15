/* globals window */
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

// No constructor in JSDom
// globalThis.DOMRect = window.DOMRect;
// globalThis.DOMRectReadOnly = window.DOMRectReadOnly;
/**
 * DOMRect class.
 */
class DOMRect {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMRect';
    }
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
}
// @ts-expect-error Not an issue
globalThis.DOMRect = DOMRect;

/**
 * DOMRectReadOnly class.
 */
class DOMRectReadOnly {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMRectReadOnly';
    }
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
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMPoint';
    }
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
}
// @ts-expect-error Not an issue
globalThis.DOMPoint = DOMPoint;

/**
 * DOMPointReadOnly class.
 */
class DOMPointReadOnly {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMPointReadOnly';
    }
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
}
// @ts-expect-error Not an issue
globalThis.DOMPointReadOnly = DOMPointReadOnly;

// No constructor in JSDom
// globalThis.DOMQuad = window.DOMQuad;
/**
 * DOMQuad class.
 */
class DOMQuad {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMQuad';
    }
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
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMMatrix';
    }
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
}
// @ts-expect-error Not an issue
globalThis.DOMMatrix = DOMMatrix;

/**
 * DOMMatrixReadOnly class.
 */
class DOMMatrixReadOnly {
    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {string}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'DOMMatrixReadOnly';
    }
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
}
// @ts-expect-error Not an issue
globalThis.DOMMatrixReadOnly = DOMMatrixReadOnly;

try {
    // Before Node < 20
    globalThis.crypto = /** @type {NodeMockAPI} */ (webcrypto);
} catch (err) {}

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876

globalThis.OffscreenCanvas = window.OffscreenCanvas;

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

await import('./FileList.js');

export const imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');
