/**
 * @type {import('typeson').TypeSpecSet}
 */
const negativeZero = {
    negativeZero: {
        test (x) {
            return Object.is(x, -0);
        },
        replace (/* n */) {
            // Just adding 0 here for minimized space; will still revive as -0
            return 0;
        },
        revive (/* s */) {
            return -0;
        }
    }
};

export default negativeZero;
