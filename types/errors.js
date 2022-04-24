/* globals InternalError */
/* eslint-env browser, node */
import {hasConstructorOf} from 'typeson';

const errors = {};

// JS standard
[
    TypeError, RangeError, SyntaxError, ReferenceError, EvalError, URIError
].forEach((error) => create(error));

/* c8 ignore next 2 */
// @ts-ignore Non-standard
typeof InternalError === 'function' && create(InternalError);

/**
 * Comprises all built-in errors.
 * @param {
 *   TypeError|RangeError|SyntaxError|ReferenceError|EvalError|URIError|
 *   InternalError
 * } Ctor
 * @returns {void}
 */
function create (Ctor) {
    errors[Ctor.name.toLowerCase()] = {
        test (x) { return hasConstructorOf(x, Ctor); },
        replace (e) { return e.message; },
        revive (message) { return new Ctor(message); }
    };
}

export default errors;
