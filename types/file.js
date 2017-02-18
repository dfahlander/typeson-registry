var Typeson = require('typeson');
exports.File = {
    test: function (x) { return Typeson.toStringTag(x) === 'File'; },
    replace: function encapsulate (f) { // Sync
        var req = new XMLHttpRequest();
        req.open('GET', URL.createObjectURL(f), false); // Sync
        if (req.status !== 200 && req.status !== 0) throw new Error('Bad Blob access: ' + req.status);
        req.send();
        return {
            type: f.type,
            stringContents: req.responseText,
            name: f.name,
            lastModified: f.lastModified
        };
    },
    revive: function (o) {return new File([o.stringContents], o.name, {
        type: o.type,
        lastModified: o.lastModified
    });},
    replaceAsync: function encapsulateAsync (f) {
        return new Typeson.Promise(function (resolve, reject) {
            if (f.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                reject(new Error('The File is closed'));
                return;
            }
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                resolve({
                    type: f.type,
                    stringContents: reader.result,
                    name: f.name,
                    lastModified: f.lastModified
                });
            });
            reader.addEventListener('error', function () {
                reject(reader.error);
            });
            reader.readAsText(f);
        });
    }
};
