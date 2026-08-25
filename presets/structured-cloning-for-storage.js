import structuredCloningThrowing from './structured-cloning-throwing.js';

/**
 * @type {import('typeson').Preset}
 */
const structuredCloningForStorage = structuredCloningThrowing.concat({
    checkSharedArrayBufferException: {
        test (val) {
            // Per https://webidl.spec.whatwg.org/#idl-SharedArrayBuffer ,
            //   `SharedArrayBuffer` is a structured-cloneable *transferable*
            //   type only for `postMessage`-style contexts (with
            //   `crossOriginIsolated`); storage-oriented consumers of the
            //   structured clone algorithm (e.g. IndexedDB) reject it
            //   outright instead, so this isn't part of the more general
            //   `structuredCloningThrowing` preset this one builds on.
            if (({}.toString.call(val).slice(8, -1)) === 'SharedArrayBuffer') {
                throw new DOMException(
                    'The object cannot be cloned.', 'DataCloneError'
                );
            }
            return false;
        }
    }
});

export default structuredCloningForStorage;
