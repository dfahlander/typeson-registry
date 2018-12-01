/* eslint-env node */
// Imperfectly polyfill jsdom for testing `Blob`/`File`
// Todo: These can be removed once `URL.createObjectURL` may
//    be implemented in jsdom: https://github.com/jsdom/jsdom/issues/1721

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
    // https://github.com/jsdom/jsdom/issues/1721#issuecomment-282465529
    const blobURL = 'blob:' + serializeURLOrigin(parseURL(location.href)) + '/' + uuid();
    blobURLs[blobURL] = blob;
    return blobURL;
};

const impl = utils.implSymbol;
const _xhropen = XMLHttpRequest.prototype.open;
const _xhrOverrideMimeType = XMLHttpRequest.prototype.overrideMimeType;
// We only handle the case of binary, so no need to override `open`
//   in all cases; but this only works if override is called first
const xmlHttpRequestOverrideMimeType = function ({polyfillDataURLs} = {}) {
    return function (mimeType, ...args) {
        if (mimeType === 'text/plain; charset=x-user-defined') {
            this.open = function (method, url, async) {
                if ((/^blob:/).test(url)) {
                    const blob = blobURLs[url];
                    const responseType = 'text/plain'; // blob.type;
                    const encoded = blob[impl]._buffer.toString('binary'); // utf16le and base64 both convert lone surrogates
                    // Not usable in jsdom which makes properties readonly,
                    //   but local-xmlhttprequest can use (and jsdom can
                    //   handle data URLs anyways)
                    if (polyfillDataURLs) {
                        this.status = 200;
                        this.send = function () { };
                        this.responseType = responseType || '';
                        this.responseText = encoded || '';
                        return;
                    }
                    url = 'data:' + responseType + ',' + encodeURIComponent(encoded);
                }
                return _xhropen.call(this, method, url, async);
            };
        }
        return _xhrOverrideMimeType.call(this, mimeType, ...args);
    };
};

export {createObjectURL, xmlHttpRequestOverrideMimeType};
