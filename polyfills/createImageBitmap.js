/**
 * @param {HTMLCanvasElement} cvs
 * @returns {Promise<HTMLCanvasElement>}
 */

/**
 * @param {ImageBitmapSource & {dataset?: {toStringTag?: string}}} cvs
 * @returns {Promise<ImageBitmap>}
 */
async function createImageBitmap (cvs) {
    // This really ought not be a canvas, but it works as a simple shim
    //   for our tests
    // cvs[Symbol.toStringTag] = 'ImageBitmap';
    // Above line throwing in current jsdom now
    if (!cvs.dataset) {
        cvs.dataset = {};
    }
    cvs.dataset.toStringTag = 'ImageBitmap';
    return await (/** @type {ImageBitmap} */ (cvs));
}

export {createImageBitmap};
