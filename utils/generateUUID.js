/* globals performance */

// The `performance` global is optional

/**
 * @todo We could use `import generateUUID from 'uuid/v4';` (but it needs
 *   crypto library, etc.; `rollup-plugin-node-builtins` doesn't recommend
 *   using its own version and though there is <https://www.npmjs.com/package/crypto-browserify>,
 *   it may be troublesome to bundle and not strongly needed)
 * @returns {string}
 */
export default function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, function (c) {
        /* eslint-disable no-bitwise */
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        /* eslint-enable no-bitwise */
    });
}
