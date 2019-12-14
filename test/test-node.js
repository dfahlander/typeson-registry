/* globals mocha, run, XMLHttpRequest */
/* eslint-env node */
import path from 'path';

import chai from 'chai';
import jsdom from 'jsdom';
import canvas from 'canvas';
import socketIO from 'socket.io';
import socketIOClient from 'socket.io-client';
import Typeson from '../index.js';

const __dirname = path.resolve(path.dirname(decodeURI(
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    new URL(import.meta.url).pathname
)));

const {JSDOM} = jsdom;

const dom = new JSDOM('', {
    // Needed to load an image file
    // https://github.com/tmpvar/jsdom#external-resources
    resources: 'usable'
});

global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = global.window.HTMLElement; // https://github.com/chaijs/type-detect/issues/98

// This should be made available automatically by jsdom: https://github.com/jsdom/jsdom/issues/1749
global.ImageData = canvas.ImageData;

global.FileReader = window.FileReader;
// Used by our test-environment `FileList` polyfill
global.HTMLInputElement = window.HTMLInputElement;

global.FileList = window.FileList;

global.XMLHttpRequest = window.XMLHttpRequest;

// eslint-disable-next-line node/no-unsupported-features/node-builtins
global.URL = window.URL;
global.location = window.location;

global.Blob = window.Blob;
global.File = window.File;
global.DOMException = window.DOMException;
global.performance = window.performance;

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876
global.createImageBitmap = function (cvs) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(function (resolve, reject) {
        // This really ought not be a canvas, but it works as a simple shim
        //   for our tests
        // cvs[Symbol.toStringTag] = 'ImageBitmap';
        // Above line throwing in current jsdom now
        if (!cvs.dataset) {
            cvs.dataset = {};
        }
        cvs.dataset.toStringTag = 'ImageBitmap';
        resolve(cvs);
    });
};

// We set this up separately from test-environment.js as it uses its own mocha
// eslint-disable-next-line no-empty-function
global.mocha = {setup () {}, globals () {}, checkLeaks () {}, run () {}};

global.imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');

global.io = socketIO();
global.socketIOClient = socketIOClient;

global.chai = window.chai = chai;

global.Typeson = window.Typeson = Typeson;
// var Typeson = require('../dist/all.js');

// Todo[engine:node@>=7.6.0]: Remove after engines supporting
// eslint-disable-next-line node/no-unsupported-features/es-syntax
(async function () {
// require('./test-environment.js');
var tests; // eslint-disable-line no-var

const {
    createObjectURL, revokeObjectURL,

    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} = await import('../polyfills/createObjectURL.js');

// eslint-disable-next-line node/no-unsupported-features/node-builtins
if (!URL.createObjectURL) {
    // Does not work for the browser
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    URL.createObjectURL = createObjectURL;
    XMLHttpRequest.prototype.overrideMimeType =
        xmlHttpRequestOverrideMimeType();
}

// eslint-disable-next-line node/no-unsupported-features/node-builtins
if (!URL.revokeObjectURL) {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    URL.revokeObjectURL = revokeObjectURL;
}

global.xmlHttpRequestOverrideMimeType = xmlHttpRequestOverrideMimeType;

// Filed https://github.com/eslint/eslint/issues/11808 to allow
/* eslint-disable no-process-env */
if (process.env.npm_config_test) {
    tests = [process.env.npm_config_test];
    console.log('Running test: ' + process.env.npm_config_test);
    /* eslint-enable no-process-env */
} else {
    tests = [
        './test.js'
    ];
}
await Promise.all(tests.map(function (test) {
    return import(test);
}));

// See https://mochajs.org/#delayed-root-suite
run();
mocha.run();
}());
