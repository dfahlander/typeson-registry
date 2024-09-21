/**
 * @todo We could use `import generateUUID from 'uuid/v4';` (but it needs
 *   crypto library, etc.; `rollup-plugin-node-builtins` doesn't recommend
 *   using its own version and though there is <https://www.npmjs.com/package/crypto-browserify>,
 *   it may be troublesome to bundle and not strongly needed)
 * @returns {string}
 */
export default function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    /* c8 ignore next */
    let d = Date.now();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/gu, function (c) {
        /* eslint-disable no-bitwise, sonarjs/pseudo-random -- Convenient */
        const r = Math.trunc((d + (Math.random() * 16)) % 16);
        d = Math.floor(d / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
        /* eslint-enable no-bitwise, sonarjs/pseudo-random -- Convenient */
    });
}
