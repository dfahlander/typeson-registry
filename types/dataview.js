var Typeson = require('typeson');
exports.DataView = [
    function (x) { return Typeson.toStringTag(x) === 'DataView'; },
    function (dw) { return { buffer: dw.buffer, byteOffset: dw.byteOffset, byteLength: dw.byteLength }; },
    function (obj) { return new DataView(obj.buffer, obj.byteOffset, obj.byteLength); }
];
