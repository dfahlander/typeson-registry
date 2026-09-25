/* eslint-disable n/no-unsupported-features/node-builtins -- Polyfilling */
/**
 * @param {{
 *   create: (options: string[]) => GPU,
 *   globals: object
 * }} cfg
 * @returns {void}
 */
function buildWebgpu ({create, globals}) {
    // Mix in WebGPU globals globally if required
    Object.assign(globalThis, globals);

    Object.defineProperty(
        globalThis.GPUCompilationMessage.prototype, Symbol.toStringTag, {
            get () {
                return 'GPUCompilationMessage';
            }
        }
    );
    Object.defineProperty(
        globalThis.GPUCompilationInfo.prototype, Symbol.toStringTag, {
            get () {
                return 'GPUCompilationInfo';
            }
        }
    );

    // Initialize the native GPU instance
    if (typeof navigator !== 'undefined' && !navigator.gpu) {
        // @ts-expect-error Not existing on NOde
        navigator.gpu = create([]);
    }
}

export {buildWebgpu};
