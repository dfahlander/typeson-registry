/* eslint-env mocha, node */
/* globals chai */
/* eslint-disable import/unambiguous */

// Setup Mocha and Chai
mocha.setup({ui: 'bdd', timeout: 5000});

// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/jsdom/jsdom/issues/1272
const glob = typeof module !== 'undefined' ? global : window;

/**
 * @class
 */
function FileList () {
    // eslint-disable-next-line prefer-rest-params
    this._files = arguments[0];
    this.length = this._files.length;
}
FileList.prototype.item = function (index) {
    return this._files[index];
};
FileList.prototype[Symbol.toStringTag] = 'FileList';
Object.defineProperty(glob.HTMLInputElement.prototype, 'files', {
    get () {
        return new FileList(this._files);
    },
    set (val) {
        this._files = val;
    }
});
glob.FileList = FileList;

glob.expect = chai.expect;
glob.assert = chai.assert;
