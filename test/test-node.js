/* eslint-env node */
const path = require('path');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const dom = new JSDOM('', {
    // Needed to load an image file
    // https://github.com/tmpvar/jsdom#external-resources
    resources: 'usable'
});

global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = global.window.HTMLElement; // https://github.com/chaijs/type-detect/issues/98

// Todo: Check whether this is still an issue now that we're using Rollup
// We set this up separately from test-environment.js as browserify doesn't seem to be able to handle them properly
// Should be made available automatically by jsdom anyways: https://github.com/tmpvar/jsdom/issues/1749
global.ImageData = require('canvas').ImageData;

global.FileReader = window.FileReader;
global.HTMLInputElement = window.HTMLInputElement; // Used by our test-environment FileList polyfill

global.FileList = window.FileList;
FileList.prototype[Symbol.toStringTag] = 'FileList';

global.XMLHttpRequest = window.XMLHttpRequest;
global.URL = window.URL;
global.location = window.location;

global.Blob = window.Blob;
Blob.prototype[Symbol.toStringTag] = 'Blob';
global.File = window.File;
File.prototype[Symbol.toStringTag] = 'File';

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876
global.createImageBitmap = function (canvas) {
    return new Promise(function (resolve, reject) {
        // This really ought not be a canvas, but it works as a simple shim for our tests
        canvas[Symbol.toStringTag] = 'ImageBitmap';
        // Above line not working in current jsdom now
        if (!canvas.dataset) {
            canvas.dataset = {};
        }
        canvas.dataset.toStringTag = 'ImageBitmap';
        resolve(canvas);
    });
};

// We set this up separately from test-environment.js as it uses its own mocha
global.mocha = {setup () {}, globals () {}, checkLeaks () {}, run () {}};

global.imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');

/* eslint-env node */
if (typeof global === 'undefined') {
    global = window; // eslint-disable-line no-global-assign
}
global.chai = window.chai = require('chai');

global.Typeson = window.Typeson = require('typeson');
// var Typeson = require('../dist/all.js');

(function () {
// require('./test-environment.js');

var tests; // eslint-disable-line no-var

if (process.env.npm_config_test) {
    tests = [process.env.npm_config_test];
    console.log('Running test: ' + process.env.npm_config_test);
} else {
    tests = [
        'test.js'
    ];
}
tests.forEach(function (path) {
    require('../node_modules/@babel/polyfill/dist/polyfill.js');
    require('./test-polyglot.js');
});
}());
