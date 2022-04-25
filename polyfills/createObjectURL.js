/* globals location, XMLHttpRequest, DOMException */

// Imperfectly polyfill jsdom for testing `Blob`/`File`

// Todo: `generateUUID` and `whatwgURL` can be removed once
//    `URL.createObjectURL` may be implemented in jsdom:
//    https://github.com/jsdom/jsdom/issues/1721
//    though local-xmlhttprequest may need to be adapted
// import whatwgURL from 'whatwg-url';

// These are not working well with Rollup as imports
// We also need to tweak `XMLHttpRequest` which our types
//    rely on to obtain the Blob/File content
import whatwgURL from 'whatwg-url';
// eslint-disable-next-line n/no-unpublished-import
import * as utils from 'jsdom/lib/jsdom/living/generated/utils.js';
import generateUUID from '../utils/generateUUID.js';

const {serializeURLOrigin, parseURL} = whatwgURL;

/*
both are problematic:
eslint-disable-next-line n/no-unpublished-import
eslint-disable n/file-extension-in-import, import/extensions
import {serializeURLOrigin, parseURL} from 'whatwg-url';
import utils from 'jsdom/lib/jsdom/living/generated/utils';
*/

const blobURLs = {};
const createObjectURL = function (blob) {
    // https://github.com/jsdom/jsdom/issues/1721#issuecomment-282465529
    const blobURL = 'blob:' +
        serializeURLOrigin(parseURL(location.href)) + '/' + generateUUID();
    blobURLs[blobURL] = blob;
    return blobURL;
};

const revokeObjectURL = function (blobURL) {
    delete blobURLs[blobURL];
};

const {implForWrapper} = utils.default;

// We only handle the case of binary, so no need to override `open`
//   in all cases; but this only works if override is called first
const xmlHttpRequestOverrideMimeType = function ({polyfillDataURLs} = {}) {
    // Set these references late in case global `XMLHttpRequest` has since
    //  been changed/set
    const _xhropen = XMLHttpRequest.prototype.open;
    const _xhrOverrideMimeType = XMLHttpRequest.prototype.overrideMimeType;
    return function (mimeType, ...args) {
        if (mimeType === 'text/plain; charset=x-user-defined') {
            this.open = function (method, url, async) {
                if (url.startsWith('blob:')) {
                    const blob = blobURLs[url];
                    if (!blob) {
                        this.send = function () {
                            throw new DOMException(
                                `Failed to execute 'send' on ` +
                                    `'XMLHttpRequest': Failed to ` +
                                    `load '${url}'`,
                                'NetworkError'
                            );
                        };
                        return undefined;
                    }
                    const responseType = 'text/plain'; // blob.type;
                    // utf16le and base64 both convert lone surrogates
                    // eslint-disable-next-line max-len -- Long
                    const encoded = implForWrapper(blob)._buffer.toString('binary');
                    // Not usable in jsdom which makes properties readonly,
                    //   but local-xmlhttprequest can use (and jsdom can
                    //   handle data URLs anyways)
                    if (polyfillDataURLs) {
                        this.status = 200;
                        this.send = function () {
                            // Empty
                        };
                        this.responseType = responseType;
                        this.responseText = encoded;
                        return undefined;
                    }
                    url = 'data:' + responseType + ',' +
                        encodeURIComponent(encoded);
                }
                return _xhropen.call(this, method, url, async);
            };
        }
        // The presence of `XMLHttpRequest.prototype.overrideMimeType`
        //   is not really needed here, so making optional
        return _xhrOverrideMimeType &&
            _xhrOverrideMimeType.call(this, mimeType, ...args);
    };
};

export {createObjectURL, xmlHttpRequestOverrideMimeType, revokeObjectURL};
