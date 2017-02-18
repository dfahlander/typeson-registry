/** ImageBitmap is browser / DOM specific. It also can only work same-domain (or CORS)
*/
var Typeson = require('typeson');
exports.ImageBitmap = {
    test: function (x) { return Typeson.toStringTag(x) === 'ImageBitmap'; },
    replace: function (bm) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bm, 0, 0);
        // Although `width` and `height` are part of `ImageBitMap`, these will
        //   be auto-created for us when reviving with the data URL (and they are
        //   not settable even if they weren't)
        // return {width: bm.width, height: bm.height, dataURL: canvas.toDataURL()};
        return canvas.toDataURL();
    },
    revive: function (o) {
        /*
        var req = new XMLHttpRequest();
        req.open('GET', o, false); // Sync
        if (req.status !== 200 && req.status !== 0) throw new Error('Bad ImageBitmap access: ' + req.status);
        req.send();
        return req.responseText;
        */
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        img.src = o;
        return canvas; // Works in contexts allowing an ImageBitmap (We might use `OffscreenCanvas.transferToBitmap` when supported)
    },
    reviveAsync: function reviveAsync (o) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        img.src = o; // o.dataURL;
        return createImageBitmap(canvas); // Returns a promise
    }
};
