import {toStringTag} from 'typeson';

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
            const e = new Error(obj.message);
            [
                'name', 'cause', 'stack', 'fileName', 'lineNumber',
                'columnNumber'
            ].forEach((prop) => {
                e[prop] = obj[prop];
            });
            return e;
        }
    }
};
// See also errors.js that may be registered after having registered this type.

export default error;
