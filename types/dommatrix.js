/* globals DOMMatrix, DOMMatrixReadOnly -- Polyfills */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const dommatrix = {};

/* c8 ignore next */
if (typeof DOMMatrix !== 'undefined') {
    create(DOMMatrix);
}
/* c8 ignore next */
if (typeof DOMMatrixReadOnly !== 'undefined') {
    create(DOMMatrixReadOnly);
}

/**
 * @param {typeof DOMMatrix|typeof DOMMatrixReadOnly} Ctor
 * @returns {void}
 */
function create (Ctor) {
    dommatrix[Ctor.name.toLowerCase()] = {
        test (x) { return toStringTag(x) === Ctor.name; },
        replace (dm) {
            if (dm.is2D) {
                return {
                    a: dm.a,
                    b: dm.b,
                    c: dm.c,
                    d: dm.d,
                    e: dm.e,
                    f: dm.f
                };
            }
            return {
                m11: dm.m11,
                m12: dm.m12,
                m13: dm.m13,
                m14: dm.m14,
                m21: dm.m21,
                m22: dm.m22,
                m23: dm.m23,
                m24: dm.m24,
                m31: dm.m31,
                m32: dm.m32,
                m33: dm.m33,
                m34: dm.m34,
                m41: dm.m41,
                m42: dm.m42,
                m43: dm.m43,
                m44: dm.m44
            };
        },
        revive (o) {
            if (Object.hasOwn(o, 'a')) {
                return new Ctor([o.a, o.b, o.c, o.d, o.e, o.f]);
            }
            return new Ctor([
                o.m11, o.m12, o.m13, o.m14,
                o.m21, o.m22, o.m23, o.m24,
                o.m31, o.m32, o.m33, o.m34,
                o.m41, o.m42, o.m43, o.m44
            ]);
        }
    };
}

export default dommatrix;
