import Typeson from 'typeson';
import file from './file.js';

const filelist = {
    file: file.file,
    filelist: {
        test (x) { return Typeson.toStringTag(x) === 'FileList'; },
        replace (fl) {
            const arr = [];
            for (let i = 0; i < fl.length; i++) {
                arr[i] = fl.item(i);
            }
            return arr;
        },
        revive (o) {
            class FileList {
                constructor () {
                    // eslint-disable-next-line prefer-rest-params
                    this._files = arguments[0];
                    this.length = this._files.length;
                }
                item (index) {
                    return this._files[index];
                }
                // eslint-disable-next-line class-methods-use-this
                get [Symbol.toStringTag] () {
                    return 'FileList';
                }
            }
            return new FileList(o);
        }
    }
};

export default filelist;
