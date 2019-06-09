/* globals InternalError */
/* eslint-env browser, node */
import {hasConstructorOf} from 'typeson';

const errors = {};

// JS standard
[
    TypeError, RangeError, SyntaxError, ReferenceError, EvalError, URIError
].forEach((error) => create(error));

/* c8 ignore next 3 */
if (typeof AggregateError !== 'undefined') {
    create(AggregateError);
}

/* c8 ignore next 2 */
// @ts-ignore Non-standard
typeof InternalError === 'function' && create(InternalError);

/**
 * Comprises all built-in errors.
 * @param {
 *   TypeError|RangeError|SyntaxError|ReferenceError|EvalError|URIError|
 *   AggregateError|InternalError
 * } Ctor
 * @returns {void}
 */
function create (Ctor) {
    errors[Ctor.name.toLowerCase()] = {
        test (x) { return hasConstructorOf(x, Ctor); },
        replace ({
            name, message, cause, stack, fileName,
            lineNumber, columnNumber, errors: errs
        }) {
            return {
                name, message, cause, stack, fileName,
                lineNumber, columnNumber, errors: errs
            };
        },
        revive (obj) {
            const isAggregateError = typeof AggregateError !== 'undefined' &&
                Ctor === AggregateError;
            const e = isAggregateError
                ? new Ctor(obj.errors, obj.message)
                : new Ctor(obj.message);
            [
                'name', 'cause', 'stack', 'fileName', 'lineNumber',
                'columnNumber'
            ].forEach((prop) => {
                e[prop] = obj[prop];
            });
            /* c8 ignore next 6 */
            if (isAggregateError) {
                e.errors = obj.errors;
            }
            return e;
        }
    };
}

export default errors;
