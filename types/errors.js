/* globals InternalError */
/* eslint-env browser, node */
import {hasConstructorOf} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const errors = {};

// JS standard
[
    TypeError, RangeError, SyntaxError, ReferenceError,
    EvalError, URIError
].forEach((error) => create(error));

/* c8 ignore next 3 */
if (typeof AggregateError !== 'undefined') {
    create(AggregateError);
}

/* c8 ignore next 5 */
// @ts-expect-error Non-standard
if (typeof InternalError === 'function') {
    // @ts-expect-error Non-standard
    create(InternalError);
}

/* eslint-disable jsdoc/valid-types -- https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131 */
/**
 * Non-standard.
 * @typedef {{
 *     new (message?: string, options?: ErrorOptions): EvalError;
 * (message?: string, options?: ErrorOptions): EvalError;
 * }} InternalErrorConstructor
 */
/* eslint-enable jsdoc/valid-types -- https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131 */

/**
 * Comprises all built-in errors.
 * @param {TypeErrorConstructor|RangeErrorConstructor|
 *   SyntaxErrorConstructor|ReferenceErrorConstructor|
 *   EvalErrorConstructor|URIErrorConstructor|
 *   AggregateErrorConstructor|InternalErrorConstructor
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
            const e = /**
                * @type {{
                *   name: string,
                *   cause: Error,
                *   stack: string,
                *   fileName?: string,
                *   lineNumber?: import('typeson').Integer,
                *   columnNumber?: import('typeson').Integer
                * }}
                */ (isAggregateError
                    ? new /** @type {AggregateErrorConstructor} */ (
                        Ctor
                    )(obj.errors, obj.message)
                    : new /**
                    * @type {TypeErrorConstructor|RangeErrorConstructor|
                    *   SyntaxErrorConstructor|ReferenceErrorConstructor|
                    *   EvalErrorConstructor|URIErrorConstructor|
                    *   InternalErrorConstructor}
                    */ (Ctor)(obj.message));

            e.name = obj.name;
            e.cause = obj.cause;
            e.stack = obj.stack;
            e.fileName = obj.fileName;
            e.lineNumber = obj.lineNumber;
            e.columnNumber = obj.columnNumber;

            return e;
        }
    };
}

export default errors;
