var Typeson = require('typeson');
exports.Blob = {
    test: function (x) { return Typeson.toStringTag(x) === 'Blob'; },
    replace: function encapsulate (b) { // Sync
        var req = new XMLHttpRequest();
        req.open('GET', URL.createObjectURL(b), false); // Sync
        if (req.status !== 200 && req.status !== 0) throw new Error('Bad Blob access: ' + req.status);
        req.send();
        return {
            type: b.type,
            stringContents: req.responseText
        };
    },
    revive: function (o) {return new Blob([o.stringContents], {
        type: o.type
    });},
    replaceAsync: function encapsulateAsync (b) {
        return new Typeson.Promise(function (resolve, reject) {
            if (b.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                reject(new Error('The Blob is closed'));
                return;
            }
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                resolve({
                    type: b.type,
                    stringContents: reader.result
                });
            });
            reader.addEventListener('error', function () {
                reject(reader.error);
            });
            reader.readAsText(b);
        });
    }
};
