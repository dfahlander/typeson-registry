var Typeson = require('typeson');
var B64 = require ('base64-arraybuffer');
exports.DataView = [
    function (x) { return Typeson.toStringTag(x) === 'DataView'; },
    function (dw) { return { buffer: B64.encode(dw.buffer), byteOffset: dw.byteOffset, byteLength: dw.byteLength }; },
    function (obj) { return new DataView(B64.decode(obj.buffer), obj.byteOffset, obj.byteLength); }
];
