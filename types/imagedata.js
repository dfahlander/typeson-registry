/** ImageData is browser / DOM specific (though `node-canvas` has it available on `Canvas`).
*/
var Typeson = require('typeson');
exports.ImageData = [
    function (x) { return Typeson.toStringTag(x) === 'ImageData'; },
    function (d) {
        return {
            array: Array.from(d.data), // Ensure `length` gets preserved for revival
            width: d.width,
            height: d.height
        };
    },
    function (o) {return new ImageData(new Uint8ClampedArray(o.array), o.width, o.height);}
];
