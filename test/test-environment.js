/* eslint-env mocha, node */
/* globals chai */

// For Node (we put here as this is exported and to be usable externally in ES6 module syntax
//     whereas the `test-node.js` file has not been converted to ES6)
import {createObjectURL, xmlHttpRequestOverrideMimeType} from '../polyfills/createObjectURL.js';
if (!URL.createObjectURL) {
    URL.createObjectURL = createObjectURL;
    XMLHttpRequest.prototype.overrideMimeType = xmlHttpRequestOverrideMimeType();
}

// Setup Mocha and Chai
mocha.setup({ui: 'bdd', timeout: 5000});

// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/tmpvar/jsdom/issues/1272
const glob = typeof module !== 'undefined' ? global : window;
function FileList () {
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

export default null; // Just add a placeholder for tests.js
