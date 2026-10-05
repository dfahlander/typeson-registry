/* globals GPUPipelineError -- Newer API */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const gpupipelineerror = {
    gpupipelineerror: {
        test (x) { return toStringTag(x) === 'GPUPipelineError'; },
        // Note that we can't support the `source` property (defaults
        //   to `stream` instead of `session`)
        replace ({
            message, reason,
            cause, stack, fileName, lineNumber, columnNumber
        }) {
            return {
                message, reason,
                cause, stack, fileName, lineNumber, columnNumber
            };
        },
        revive (obj) {
            const {message, reason} = obj;
            // TS lib still models the older two-argument
            //   `(message, options)` form; browsers implement a single
            //   `init` object (which also carries `message`).
            const e = /**
                       * @type {{
                       *   name: string,
                       *   cause: Error,
                       *   stack: string,
                       *   fileName?: string,
                       *   lineNumber?: import('typeson').Integer,
                       *   columnNumber?: import('typeson').Integer
                       * }}
                       */
                (new GPUPipelineError(message, {reason}));

            e.cause = obj.cause;
            e.stack = obj.stack;
            e.fileName = obj.fileName;
            e.lineNumber = obj.lineNumber;
            e.columnNumber = obj.columnNumber;

            return e;
        }
    }
};

export default gpupipelineerror;
