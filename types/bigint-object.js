/* globals BigInt */
import Typeson from 'typeson';
export default {
    bigintObject: {
        test (x) { return typeof x === 'object' && Typeson.hasConstructorOf(x, BigInt); },
        replace (n) { return String(n); },
        revive (s) { return Object(BigInt(s)); }
    }
};
