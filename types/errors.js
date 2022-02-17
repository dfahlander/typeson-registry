/* eslint-env browser, node */
import {hasConstructorOf} from 'typeson';

/* c8 ignore next */
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
            test (x) { return hasConstructorOf(x, Cnstrctr); },
            replace (e) { return e.message; },
            revive (message) { return new Cnstrctr(message); }
        };
    }
});

export default errors;
