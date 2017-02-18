var path = require('path');

global.document = require('jsdom').jsdom('', {features: {
    // Needed to load an image file
    // https://github.com/tmpvar/jsdom#external-resources
    FetchExternalResources: ['img']
}});
global.window = document.defaultView;

// We set this up separately from test-entry.js as browserify doesn't seem to be able to handle them properly
// Should be made available automatically by jsdom anyways: https://github.com/tmpvar/jsdom/issues/1749
global.ImageData = require('canvas').ImageData;

global.FileReader = window.FileReader;
global.HTMLInputElement = window.HTMLInputElement; // Used by our test-entry FileList polyfill

global.FileList = window.FileList;
FileList.prototype[Symbol.toStringTag] = 'FileList';

global.XMLHttpRequest = window.XMLHttpRequest;
global.URL = window.URL;
global.location = window.location;

global.Blob = window.Blob;
Blob.prototype[Symbol.toStringTag] = 'Blob';
global.File = window.File;
File.prototype[Symbol.toStringTag] = 'File';

require('./createObjectURL'); // Polyfill enough for our tests

// Should be available in jsdom: https://github.com/Automattic/node-canvas/issues/876
global.createImageBitmap = function (canvas) {
    return new Promise(function (res, rej) {
        // This really ought not be a canvas, but it works as a simple shim for our tests
        canvas[Symbol.toStringTag] = 'ImageBitmap';
        res(canvas);
    });
};

// We set this up separately from test-entry.js as it defines its own mocha
global.mocha = {setup: function () {}, globals: function () {}, checkLeaks: function () {}, run: function () {}};

global.imageTestFileNode = 'file://' + path.resolve(__dirname, 'Flag_of_the_United_Nations.png');

require('./test-entry');
