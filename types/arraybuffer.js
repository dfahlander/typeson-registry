import Typeson from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';

export default {
    arraybuffer: {
        test (x) { return Typeson.toStringTag(x) === 'ArrayBuffer'; },
        replace (b) { return encode(b); },
        revive (b64) { return decode(b64); }
    }
};

// See also typed-arrays!
