/** ImageData is browser / DOM specific.
 * Requires arraybuffer.js in order for the returned Uint8ClampedArray to be encapsulated as well,
 * or if use with socket.io, socket.io will take care of that.
*/
exports.ImageData = [
    function (x) { return x instanceof ImageData; },
    function (d) { return {array: d.data, width: d.width, height: d.height}; },
    function (o) { return new ImageData(o.array, o.width, o.height); }
];
