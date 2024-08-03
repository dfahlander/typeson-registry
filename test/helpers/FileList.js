// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/jsdom/jsdom/issues/1272

/**
 * @class
 */
function _FileList () {
    // eslint-disable-next-line prefer-rest-params -- API
    this._files = arguments[0];
    this.length = this._files.length;
}

/**
 * @param {import('typeson').Integer} index
 * @returns {File}
 */
_FileList.prototype.item = function (index) {
    return this._files[index];
};
Object.defineProperty(_FileList.prototype, Symbol.toStringTag, {
    value: 'FileList'
});
Object.defineProperty(globalThis.HTMLInputElement.prototype, 'files', {
    get () {
        return new _FileList(this._files);
    },
    set (val) {
        this._files = val;
    }
});

const placeholder = 'placeholder';

export default placeholder;
