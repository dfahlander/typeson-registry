// Imperfectly polyfill jsdom for testing `Blob`/`File`
// Todo: This can be removed once `URL.createObjectURL` may be implemented in jsdom: https://github.com/tmpvar/jsdom/issues/1721
var serializeURL = require('whatwg-url').serializeURL;
if (typeof URL.createObjectURL === 'undefined') {
    var uuid = require('uuid/v4');
    var blobURLs = {};
    URL.createObjectURL = function (blob) {
        // https://github.com/tmpvar/jsdom/issues/1721#issuecomment-282465529
        var blobURL = 'blob:' + (location.origin !== 'null' ? serializeURL(location.origin) : 'null') + '/' + uuid();
        blobURLs[blobURL] = blob;
        return blobURL;
    };
    // We also need to tweak `XMLHttpRequest` which our types rely on to obtain the Blob/File content
    var B64 = require('base64-arraybuffer');
    var utils = require('jsdom/lib/jsdom/living/generated/utils');
    var impl = utils.implSymbol;
    var _xhropen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        if ((/^blob:/).test(url)) {
            var blob = blobURLs[url];
            var type = blob.type;
			if (type === null) {
				type = 'application/octet-stream';
			}
            url = 'data:' + type + ';base64,' + B64.encode(blob[impl]._buffer);
        }
        return _xhropen.call(this, method, url, async);
    };
}
