import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const gpucompilationmessage = {
    gpucompilationmessage: {
        test (x) {
            return toStringTag(x) === 'GPUCompilationMessage';
        },
        replace ({length, lineNum, linePos, message, offset, type}) {
            return {length, lineNum, linePos, message, offset, type};
        },
        revive ({length, lineNum, linePos, message, offset, type}) {
            /* eslint-disable class-methods-use-this -- Don't need */
            /**
             * `GPUCompilationInfo` polyfill.
             */
            class GPUCompilationMessage {
                /**
                 * @returns {string}
                 */
                get [Symbol.toStringTag] () {
                    return 'GPUCompilationMessage';
                }

                /**
                 * @returns {number}
                 */
                get length () {
                    return length;
                }

                /**
                 * @returns {number}
                 */
                get lineNum () {
                    return lineNum;
                }

                /**
                 * @returns {number}
                 */
                get linePos () {
                    return linePos;
                }

                /**
                 * @returns {string}
                 */
                get message () {
                    return message;
                }

                /**
                 * @returns {number}
                 */
                get offset () {
                    return offset;
                }

                /**
                 * @returns {"error"|"info"|"warning"}
                 */
                get type () {
                    return type;
                }
                /* eslint-enable class-methods-use-this -- Don't need */
            }
            return new GPUCompilationMessage();
        }
    }
};

export default gpucompilationmessage;
