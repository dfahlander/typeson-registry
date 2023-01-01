import path from 'node:path';
import http from 'node:http';

// eslint-disable-next-line no-shadow -- This is not a regular test file
import chai from 'chai';
import jsdom from 'jsdom';
import canvas from 'canvas';
import {Server} from 'socket.io';
import socketIOClient from 'socket.io-client';
import {Crypto} from 'node-webcrypto-ossl';

const __dirname = path.resolve(path.dirname(decodeURI(
    new URL(import.meta.url).pathname
)));

const {JSDOM} = jsdom;

const dom = new JSDOM('', {
    // Needed to load an image file
    // https://github.com/jsdom/jsdom#loading-subresources
    resources: 'usable'
});

global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = global.window.HTMLElement; // https://github.com/chaijs/type-detect/issues/98

// This should be made available automatically by jsdom: https://github.com/jsdom/jsdom/issues/1749
global.ImageData = canvas.ImageData;

// https://github.com/Automattic/node-canvas/issues/1646
Object.defineProperty(global.ImageData.prototype, Symbol.toStringTag, {
    get () {
        return 'ImageData';
    }
});

global.FileReader = window.FileReader;
// Used by our test-environment `FileList` polyfill
global.HTMLInputElement = window.HTMLInputElement;

global.FileList = window.FileList;

global.XMLHttpRequest = window.XMLHttpRequest;

global.URL = window.URL;
global.location = window.location;

global.Blob = window.Blob;
global.File = window.File;
global.DOMException = window.DOMException;
global.performance = window.performance;

const crypto = new Crypto();

global.crypto = crypto;

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

const server = http.createServer();
global.io = new Server(server);
global.socketIOClient = socketIOClient;

global.chai = window.chai = chai;

// require('./test-environment.js');
var tests; // eslint-disable-line no-var, vars-on-top

// Require after defining `crypto` globally
const TypesonNamespace = await import('../index.js');

global.TypesonNamespace = TypesonNamespace;
global.Typeson = window.Typeson = TypesonNamespace.Typeson;
// var Typeson = require('../dist/index.umd.js');

const {
    createObjectURL, revokeObjectURL,

    // NODE-ONLY
    xmlHttpRequestOverrideMimeType
} = await import('../polyfills/createObjectURL.js');

if (!URL.createObjectURL) {
    // Does not work for the browser
    URL.createObjectURL = createObjectURL;
    global.XMLHttpRequest.prototype.overrideMimeType =
        xmlHttpRequestOverrideMimeType();
}

if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = revokeObjectURL;
}

global.xmlHttpRequestOverrideMimeType = xmlHttpRequestOverrideMimeType;

// Filed https://github.com/eslint/eslint/issues/11808 to allow
/* eslint-disable n/no-process-env */
if (process.env.npm_config_test) {
    tests = [process.env.npm_config_test];
    console.log('Running test: ' + process.env.npm_config_test);
    /* eslint-enable n/no-process-env */
} else {
    tests = [
        './test.js'
    ];
}

try {
    await Promise.all(tests.map(function (tst) {
        console.log('tst', tst);
        // eslint-disable-next-line no-unsanitized/method
        return import(tst);
    }));
} catch (err) {
    console.error('Error', err);
}
