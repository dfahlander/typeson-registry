/* eslint-env node */
// Imperfectly polyfill jsdom for testing `Blob`/`File`
// Todo: This can be removed once `URL.createObjectURL` may
//    be implemented in jsdom: https://github.com/tmpvar/jsdom/issues/1721

// These are not working well with Rollup as imports
const mod = typeof module !== 'undefined';
const uuid = mod && require('uuid/v4');
const whatwgURL = (mod && require('whatwg-url')) || {};
// We also need to tweak `XMLHttpRequest` which our types
//    rely on to obtain the Blob/File content
const utils = (mod && require('jsdom/lib/jsdom/living/generated/utils')) || {};

const {serializeURLOrigin, parseURL} = whatwgURL;

const blobURLs = {};
const createObjectURL = function (blob) {
    // https://github.com/tmpvar/jsdom/issues/1721#issuecomment-282465529
    const blobURL = 'blob:' + serializeURLOrigin(parseURL(location.href)) + '/' + uuid();
    blobURLs[blobURL] = blob;
    return blobURL;
};

const impl = utils.implSymbol;
const _xhropen = XMLHttpRequest.prototype.open;

// Add to XMLHttpRequest.prototype.open
function xmlHttpRequestOpen (method, url, async) {
    if ((/^blob:/).test(url)) {
        const blob = blobURLs[url];
        const type = 'text/plain'; // blob.type;
        const utf16 = blob[impl]._buffer.toString('utf16le');
        url = 'data:' + type + ',' + utf16;
    }
    return _xhropen.call(this, method, url, async);
};

export {createObjectURL, xmlHttpRequestOpen};
