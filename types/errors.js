/* eslint-env browser, node */
import Typeson from 'typeson';
const _global = typeof self === 'undefined' ? global : self;

const exportObj = {};
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
    const constructor = _global[errName];
    if (constructor) {
        exportObj[errName.toLowerCase()] = {
            test (x) { return Typeson.hasConstructorOf(x, constructor); },
            replace (e) { return e.message; },
            revive (message) { return new constructor(message); }
        };
    }
});

export default exportObj;
