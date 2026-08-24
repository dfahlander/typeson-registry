// @ts-nocheck -- Uses `Buffer`, which has no types without `@types/node`
//   (matches `URL.js`'s own `@ts-nocheck`, also Node-runtime-specific)
// Node's native `Blob`/`File` only expose their bytes asynchronously
//   (`.arrayBuffer()`/`.text()`/`.stream()`), with no standard synchronous
//   accessor. `xmlHttpRequestOverrideMimeType` (see `URL.js`) needs
//   synchronous access to back the `blob`/`file` types' synchronous
//   `replace()`. For jsdom's own `Blob`/`File`, it gets this via jsdom's
//   internal wrapper-unwrapping; for any other environment (e.g. Node
//   without jsdom, as in a worker thread with no DOM), these
//   `SyncBlob`/`SyncFile` subclasses provide the same synchronous access by
//   capturing a copy of the content as a `Buffer`, at construction time,
//   before handing the same `parts` off to the real, native constructor.
//
// The copy is kept in a module-private `WeakMap`, not as a property on the
//   instance: a plain (even non-enumerable) property would let any code
//   holding a reference to the `Blob`/`File` read its full raw content
//   synchronously, bypassing the normal, async-only `Blob`/`File` API --
//   and would risk leaking into `Object.keys()`/`JSON.stringify()`/etc. of
//   an object that's supposed to look like an ordinary `Blob`/`File`. Only
//   code that imports `getSyncBytes` from this same module can read it.

/**
 * @type {WeakMap<Blob, Buffer>}
 */
const syncBytesMap = new WeakMap();

/**
 * @param {Blob} blob A `SyncBlob`/`SyncFile` (or any `Blob`/`File` this
 *   module has otherwise recorded bytes for).
 * @returns {Buffer|undefined} `undefined` if `blob` isn't one this module
 *   has a synchronous copy for.
 */
function getSyncBytes (blob) {
    return syncBytesMap.get(blob);
}

/**
 * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} parts
 * @returns {Buffer}
 */
function partsToBuffer (parts) {
    return Buffer.concat(parts.map((part) => {
        if (typeof part === 'string') {
            return Buffer.from(part, 'utf8');
        }
        if (Object.prototype.toString.call(part) === '[object ArrayBuffer]') {
            return Buffer.from(/** @type {ArrayBuffer} */ (part));
        }
        if (ArrayBuffer.isView(part)) {
            return Buffer.from(
                part.buffer, part.byteOffset, part.byteLength
            );
        }
        const partBytes = part && syncBytesMap.get(/** @type {Blob} */ (part));
        if (partBytes) {
            return partBytes;
        }
        return Buffer.from(String(part), 'utf8');
    }));
}

/**
 * A `Blob` subclass which also keeps a synchronously-readable copy of its
 *   content (accessible only via `getSyncBytes`, not as a property of the
 *   instance itself), for environments (e.g. Node without jsdom) where
 *   `Blob` alone offers no synchronous way to read it back.
 */
class SyncBlob extends Blob {
    /**
     * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} [parts]
     * @param {BlobPropertyBag} [options]
     */
    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line default-param-last -- Must match native `Blob` positionally
    constructor (parts = [], options) {
        super(parts, options);
        syncBytesMap.set(this, partsToBuffer(parts));
    }
}

/**
 * `File` counterpart to `SyncBlob` -- see its documentation for why this
 *   exists.
 */
class SyncFile extends File {
    /**
     * @param {(string|ArrayBuffer|ArrayBufferView|Blob)[]} parts
     * @param {string} name
     * @param {FilePropertyBag} [options]
     */
    constructor (parts, name, options) {
        super(parts, name, options);
        syncBytesMap.set(this, partsToBuffer(parts));
    }
}

export {SyncBlob, SyncFile, getSyncBytes};
