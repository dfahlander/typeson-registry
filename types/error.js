import Typeson from 'typeson';

const error = {
    error: {
        test (x) { return Typeson.toStringTag(x) === 'Error'; },
        replace ({name, message, stack, fileName, lineNumber, columnNumber}) {
            return {name, message, stack, fileName, lineNumber, columnNumber};
        },
        revive (obj) {
            const e = new Error(obj.message);
            [
                'name', 'stack', 'fileName', 'lineNumber', 'columnNumber'
            ].forEach((prop) => {
                e[prop] = obj[prop];
            });
            return e;
        }
    }
};
// See also errors.js that may be registered after having registered this type.

export default error;
