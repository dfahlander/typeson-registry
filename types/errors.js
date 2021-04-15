/* eslint-env browser, node */
import Typeson from 'typeson';

/* istanbul ignore next */
const _global = typeof self === 'undefined' ? global : self;

const errors = {};
// Comprises all built-in errors.
[
    'TypeError',
    'RangeError',
    'SyntaxError',
    'ReferenceError',
    'EvalError',
    'URIError',
    'InternalError' // non-standard
].forEach((errName) => {
    const Cnstrctr = _global[errName];
    if (Cnstrctr) {
        errors[errName.toLowerCase()] = {
            test (x) { return Typeson.hasConstructorOf(x, Cnstrctr); },
            replace ({
                name, message, stack, fileName, lineNumber, columnNumber
            }) {
                return {
                    name, message, stack, fileName, lineNumber, columnNumber
                };
            },
            revive (obj) {
                const e = new Cnstrctr(obj.message);
                [
                    'name', 'stack', 'fileName', 'lineNumber', 'columnNumber'
                ].forEach((prop) => {
                    e[prop] = obj[prop];
                });
                return e;
            }
        };
    }
});

export default errors;
