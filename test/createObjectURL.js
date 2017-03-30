// Imperfectly polyfill jsdom for testing `Blob`/`File`
// Todo: This can be removed once `URL.createObjectURL` may be implemented in jsdom: https://github.com/tmpvar/jsdom/issues/1721
var whatwgURL = require('whatwg-url');
var serializeURLToUnicodeOrigin = whatwgURL.serializeURLToUnicodeOrigin;
var parseURL = whatwgURL.parseURL;

if (typeof URL.createObjectURL === 'undefined') {
    var uuid = require('uuid/v4');
    var blobURLs = {};
    URL.createObjectURL = function (blob) {
        // https://github.com/tmpvar/jsdom/issues/1721#issuecomment-282465529
        var blobURL = 'blob:' + serializeURLToUnicodeOrigin(parseURL(location.href)) + '/' + uuid();
        blobURLs[blobURL] = blob;
        return blobURL;
    };
    // We also need to tweak `XMLHttpRequest` which our types rely on to obtain the Blob/File content
    var utils = require('jsdom/lib/jsdom/living/generated/utils');
    var impl = utils.implSymbol;
    var _xhropen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        if ((/^blob:/).test(url)) {
            var blob = blobURLs[url];
            var type = blob.type;
            url = 'data:' + type + ';base64,' + blob[impl]._buffer.toString('base64');
        }
        return _xhropen.call(this, method, url, async);
    };
}
