/**
 * Builds Node `canvas`-backed `ImageBitmap`, `OffscreenCanvas`, and
 *   `createImageBitmap` polyfills.
 *
 * The `canvas` package (https://github.com/Automattic/node-canvas) is a
 *   native module, so rather than this file depending on it directly (and
 *   forcing that dependency -- or a specific version of it -- onto every
 *   consumer of these polyfills), the caller supplies its own `canvas`
 *   module instance here.
 * @param {{
 *   Image: new () => import('canvas').Image,
 *   Canvas: new (
 *     width: number, height: number
 *   ) => import('canvas').Canvas
 * }} canvasModule The `canvas` package (or an equivalent), as imported
 *   by the caller, e.g., `import * as canvas from 'canvas';`.
 * @returns {{
 *   ImageBitmap: ReturnType<typeof buildImageBitmap>,
 *   OffscreenCanvas: ReturnType<typeof buildOffscreenCanvas>,
 *   createImageBitmap: (
 *     source: ImageBitmapSource
 *   ) => Promise<InstanceType<ReturnType<typeof buildImageBitmap>>>
 * }}
 */
function buildCanvasPolyfills (canvasModule) {
    const ImageBitmap = buildImageBitmap(canvasModule);
    const OffscreenCanvas = buildOffscreenCanvas(canvasModule, ImageBitmap);

    /**
     * Loads a source directly into an `ImageBitmap` instance (rather than a
     *   plain `canvas.Image`) so the result stays a real, drawable node-canvas
     *   image -- a plain object merely duck-typing `ImageBitmap`'s shape is
     *   rejected by jsdom's `CanvasRenderingContext2D#drawImage` ("Image or
     *   Canvas expected").
     * @param {string|Buffer} src
     * @returns {Promise<InstanceType<typeof ImageBitmap>>}
     */
    // eslint-disable-next-line promise/avoid-new -- Own API
    const loadAsImageBitmap = (src) => new Promise((resolve, reject) => {
        const bitmap = new ImageBitmap();
        // node-canvas's `Image` is not a DOM `EventTarget`, so it has no
        //   `addEventListener` -- only the classic `onload`/`onerror`
        //   callback properties.
        // eslint-disable-next-line unicorn/prefer-add-event-listener -- N/A
        bitmap.onload = () => resolve(bitmap);
        // eslint-disable-next-line unicorn/prefer-add-event-listener -- N/A
        bitmap.onerror = reject;
        bitmap.src = src;
    });

    /**
     * @param {ImageBitmapSource} source
     * @returns {Promise<InstanceType<typeof ImageBitmap>>}
     */
    async function createImageBitmap (source) {
        // Handle Blob (or Blob-like) sources
        if (Object.prototype.toString.call(source) === '[object Blob]' ||
            (typeof source === 'object' && source !== null &&
                'arrayBuffer' in source)) {
            const blobLike = /** @type {Blob} */ (source);
            const ab = await blobLike.arrayBuffer();
            return await loadAsImageBitmap(Buffer.from(ab));
        }

        // Handle URL strings or standard paths/buffers directly
        if (typeof source === 'string' || Buffer.isBuffer(source)) {
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
    }

    return {ImageBitmap, OffscreenCanvas, createImageBitmap};
}

/* eslint-disable jsdoc/valid-types --
    Constructor-type-returning-object-literal not parseable by jsdoc's
    type parser, though valid TypeScript */
/**
 * @param {{Image: new () => import('canvas').Image}} canvasModule
 * @returns {new () => import('canvas').Image & {
 *   [Symbol.toStringTag]: string,
 *   close: () => void
 * }}
 */
function buildImageBitmap (canvasModule) {
    /* eslint-enable jsdoc/valid-types -- See above */
    /**
     * `ImageBitmap` polyfill.
     */
    class ImageBitmap extends canvasModule.Image {
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

    return ImageBitmap;
}

/* eslint-disable jsdoc/valid-types --
    Constructor-type-returning-object-literal not parseable by jsdoc's
    type parser, though valid TypeScript */
/**
 * @param {{
 *   Canvas: new (
 *     width: number, height: number
 *   ) => import('canvas').Canvas
 * }} canvasModule
 * @param {ReturnType<typeof buildImageBitmap>} ImageBitmap
 * @returns {new (width: number, height: number) => {
 *   [Symbol.toStringTag]: string,
 *   width: number,
 *   height: number,
 *   getContext: (
 *     contextType: "2d"|"3d",
 *     contextAttributes?: import('canvas').NodeCanvasRenderingContext2DSettings
 *   ) => import('canvas').CanvasRenderingContext2D,
 *   transferToImageBitmap: () => InstanceType<typeof ImageBitmap>,
 *   convertToBlob: (options?: {type?: string}) => Promise<Blob>
 * }}
 */
function buildOffscreenCanvas (canvasModule, ImageBitmap) {
    /* eslint-enable jsdoc/valid-types -- See above */
    /**
     * `OffscreenCanvas` polyfill.
     */
    class OffscreenCanvas {
        [Symbol.toStringTag] = 'OffscreenCanvas';

        /**
         * @param {number} width
         * @param {number} height
         */
        constructor (width, height) {
            // Use node-canvas's headless Canvas instance
            this._canvas = new canvasModule.Canvas(width, height);
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
         * @param {import('canvas').
         *   NodeCanvasRenderingContext2DSettings} [contextAttributes]
         * @returns {import('canvas').CanvasRenderingContext2D}
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
         * @returns {InstanceType<typeof ImageBitmap>}
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
    }

    return OffscreenCanvas;
}

export {buildCanvasPolyfills};
