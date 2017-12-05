import Typeson from 'typeson';
import file from './file.js';
export default {
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
            function FileList () {
                this._files = arguments[0];
                this.length = this._files.length;
            }
            FileList.prototype.item = function (index) {
                return this._files[index];
            };
            FileList.prototype[Symbol.toStringTag] = 'FileList';
            return new FileList(o);
        }
    }
};
