/**
 * @param {ImageBitmapSource} cvs
 * @deprecated Use a polyfill like that used in test/helpers/test-environment.js
 * @returns {Promise<ImageBitmap>}
 */
async function createImageBitmap (cvs) {
    // This really ought not be a canvas, but it works as a simple shim
    //   for our tests

    // cvs[Symbol.toStringTag] = 'ImageBitmap';
    // Above line throwing in current jsdom now

    Object.defineProperty(cvs, Symbol.toStringTag, {
        value: 'ImageBitmap'
    });

    return await (/** @type {ImageBitmap} */ (cvs));
}

export {createImageBitmap};
