import Typeson from 'typeson';
import {encode, decode} from 'base64-arraybuffer-es6';
export default {
    dataview: {
        test (x) { return Typeson.toStringTag(x) === 'DataView'; },
        replace ({buffer, byteOffset, byteLength}) {
            return {
                buffer: encode(buffer),
                byteOffset,
                byteLength
            };
        },
        revive ({buffer, byteOffset, byteLength}) {
            return new DataView(decode(buffer), byteOffset, byteLength);
        }
    }
};
