import {toStringTag} from 'typeson';
import file from './file.js';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const filelist = {
    file: file.file,
    filelist: {
        test (x) { return toStringTag(x) === 'FileList'; },
        replace (fl) {
            const arr = [];
            for (let i = 0; i < fl.length; i++) {
                arr[i] = fl.item(i);
            }
            return arr;
        },
        revive (o) {
            /**
             * `FileList` polyfill.
             */
            class FileList {
                /**
                 * Set private properties and length.
                 */
                constructor () {
                    // eslint-disable-next-line prefer-rest-params -- API
                    this._files = arguments[0];
                    this.length = this._files.length;
                }
                /**
                 * @param {import('typeson').Integer} index
                 * @returns {File}
                 */
                item (index) {
                    return this._files[index];
                }
                /* eslint-disable class-methods-use-this -- Not needed */
                /**
                 * @returns {"FileList"}
                 */
                get [Symbol.toStringTag] () {
                    /* eslint-enable class-methods-use-this -- Not needed */
                    return 'FileList';
                }
            }
            return new FileList(o);
        }
    }
};

export default filelist;
