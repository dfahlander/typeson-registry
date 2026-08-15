import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const error = {
    error: {
        test (x) { return toStringTag(x) === 'Error'; },
        replace ({
            name, message, cause, stack, fileName, lineNumber, columnNumber
        }) {
            return {
                name, message, cause, stack, fileName, lineNumber, columnNumber
            };
        },
        revive (obj) {
            const e = /**
                       * @type {{
                       *   name: string,
                       *   cause: Error,
                       *   stack: string,
                       *   fileName?: string,
                       *   lineNumber?: import('typeson').Integer,
                       *   columnNumber?: import('typeson').Integer
                       * }}
                       */ (new Error(obj.message));
            /* eslint-disable unicorn/no-error-property-assignment -- Ok */
            e.name = obj.name;
            e.cause = obj.cause;
            e.stack = obj.stack;
            /* eslint-enable unicorn/no-error-property-assignment -- Ok */
            e.fileName = obj.fileName;
            e.lineNumber = obj.lineNumber;
            e.columnNumber = obj.columnNumber;

            return e;
        }
    }
};
// See also errors.js that may be registered after having registered this type.

export default error;
