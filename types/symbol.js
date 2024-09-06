/**
 * @type {import('typeson').TypeSpecSet}
 */
const symbol = {
    symbol: {
        test (x) {
            return typeof x === 'symbol';
        },
        replace (sym) {
            return {
                global: Symbol.keyFor(sym) !== undefined,
                sym: String(sym).slice(7, -1)
            };
        },
        revive (o) {
            return o.global ? Symbol.for(o.sym) : Symbol(o.sym);
        }
    }
};

export default symbol;
