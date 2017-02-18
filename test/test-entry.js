if (typeof global === 'undefined') {
    global = window;
}
global.chai = window.chai = require('chai');

global.Typeson = window.Typeson = require('typeson');
// var Typeson = require('../dist/all.js');

global.Array.from = require('../utils/array-from-iterator');

// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/tmpvar/jsdom/issues/1272
function FileList () {
    this._files = arguments[0];
    this.length = this._files.length;
}
FileList.prototype.item = function (index) {
    return this._files[index];
};
FileList.prototype[Symbol.toStringTag] = 'FileList';
Object.defineProperty(global.HTMLInputElement.prototype, 'files', {
    get: function () {
        return new FileList(this._files);
    },
    set: function (val) {
        this._files = val;
    }
});
global.FileList = FileList;

(function () {
    require('./test-environment.js');
    require('./test-utils.js');

    var tests; // eslint-disable-line no-var

    if (process.env.npm_config_test) {
        tests = [process.env.npm_config_test];
        console.log('Running test: ' + process.env.npm_config_test);
    } else {
        tests = [
            'test.js',
        ];
    }
    tests.forEach(function (path) {
        require('./test.js');
    });
}());
