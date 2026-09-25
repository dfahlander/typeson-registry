import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const gpucompilationinfo = {
    gpucompilationinfo: {
        test (x) {
            return toStringTag(x) === 'GPUCompilationInfo';
        },
        replace ({messages}) {
            return {messages};
        },
        revive ({messages}) {
            /* eslint-disable class-methods-use-this -- Don't need */
            /**
             * `GPUCompilationInfo` polyfill.
             */
            class GPUCompilationInfo {
                /**
                 * @returns {string}
                 */
                get [Symbol.toStringTag] () {
                    return 'GPUCompilationInfo';
                }
                /**
                 * @returns {GPUCompilationMessage[]}
                 */
                get messages () {
                    /* eslint-enable class-methods-use-this -- Don't need */
                    return messages;
                }
            }
            return new GPUCompilationInfo();
        }
    }
};

export default gpucompilationinfo;
