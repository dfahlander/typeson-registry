import structuredCloning from './structured-cloning.js';

/**
 * @param {BufferSource} buffer
 * @returns {boolean}
 */
function isBufferDetached (buffer) {
    // Use the standard property if available
    // @ts-expect-error - More recent API
    if (typeof buffer.detached === 'boolean') {
        // @ts-expect-error - More recent API
        return buffer.detached;
    }
    /* c8 ignore next 14 -- Older browsers */

    // Fallback check via byteLength and constructor test
    if (buffer.byteLength !== 0) {
        return false;
    }

    try {
        // @ts-expect-error Ok
        // eslint-disable-next-line no-new -- Throwaway
        new Uint8Array(buffer);
        return false;
    } catch {
        return true;
    }
}

/**
 * @type {import('typeson').Preset}
 */
const structuredCloningThrowing = structuredCloning.concat({
    checkDataCloneException: {
        test (val) {
            // Should also throw with:
            // 1. `IsCallable` (covered by `typeof === 'function'` or a
            //       function's `toStringTag`)
            // 2. internal slots besides [[Prototype]] or [[Extensible]] (e.g.,
            //        [[PromiseState]] or [[WeakMapData]])
            // 3. exotic object (e.g., `Proxy`) (unless an `%ObjectPrototype%`
            //      intrinsic object) (which does not have default
            //      behavior for one or more of the essential internal methods
            //      that are limited to the following for non-function objects
            //      (we auto-exclude functions):
            //      [[GetPrototypeOf]],[[SetPrototypeOf]],[[IsExtensible]],
            //      [[PreventExtensions]],[[GetOwnProperty]],
            //      [[DefineOwnProperty]],[[HasProperty]],
            //      [[Get]],[[Set]],[[Delete]],[[OwnPropertyKeys]]);
            //      except for the standard, built-in exotic objects, we'd need
            //      to know whether these methods had distinct behaviors
            // Note: There is no apparent way for us to detect a `Proxy` and
            //      reject (Chrome at least is not rejecting anyways)
            const stringTag = ({}.toString.call(val).slice(8, -1));
            if (
                [
                    // Symbol's `toStringTag` is only "Symbol" for its initial
                    //   value, so we check `typeof`
                    'symbol',
                    // All functions including bound function exotic objects
                    'function'
                ].includes(typeof val) ||
                [
                    // A non-array exotic object
                    'Arguments',
                    // A non-array exotic object
                    'Module',
                    // Promise instances have an extra slot ([[PromiseState]])
                    //    but not throwing in Chrome `postMessage`
                    'Promise',
                    // WeakMap instances have an extra slot ([[WeakMapData]])
                    //    but not throwing in Chrome `postMessage`
                    'WeakMap',
                    // WeakSet instances have an extra slot ([[WeakSetData]])
                    //    but not throwing in Chrome `postMessage`
                    'WeakSet',

                    // HTML-SPECIFIC
                    'Event',
                    // Also in Node `worker_threads` (currently experimental)
                    'MessageChannel',
                    'MessagePort'
                ].includes(stringTag) ||
                // Node's native `worker_threads` `MessageChannel`/
                //   `MessagePort` don't set `Symbol.toStringTag` per
                //      https://github.com/nodejs/node/issues/65527
                //   (verified directly:
                //   `{}.toString.call(new MessageChannel())` is
                //   `"[object Object]"`, and `.port1`'s is
                //   `"[object EventTarget]"`, its own base class), so the
                //   `stringTag` check above can't catch them there; a real
                //   browser's `MessagePort`/`MessageChannel` already match
                //   via `stringTag` (or, for `MessagePort`, would need its
                //   own `stringTag` entry if ever seen failing to match) --
                //   this is purely a fallback for environments (like Node)
                //   that don't set the tag.
                (val && val.constructor && [
                    'MessageChannel', 'MessagePort'
                ].includes(val.constructor.name)) ||
                // 1. `IsDetachedBuffer` (a process not called within the
                //      ECMAScript spec)
                ([
                    'ArrayBuffer',
                    'DataView',
                    'Int8Array',
                    'Uint8Array',
                    'Uint8ClampedArray',
                    'Int16Array',
                    'Uint16Array',
                    'Int32Array',
                    'Uint32Array',
                    'Float32Array',
                    'Float64Array',
                    'BigInt64Array',
                    'BigUint64Array'
                ].includes(stringTag) && isBufferDetached(val)) ||
                /*
                // isClosed is no longer documented
                ((stringTag === 'Blob' || stringTag === 'File') &&
                    val.isClosed) ||
                */
                (val && typeof val === 'object' &&
                    // Duck-type DOM node objects (non-array exotic?
                    //    objects which cannot be cloned by the SCA)
                    typeof val.nodeType === 'number' &&
                    typeof val.insertBefore === 'function')
            ) {
                throw new DOMException(
                    'The object cannot be cloned.', 'DataCloneError'
                );
            }
            return false;
        }
    }
});

export default structuredCloningThrowing;
