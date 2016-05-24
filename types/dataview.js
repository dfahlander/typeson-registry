exports.DataView = [
    function (x) { return x instanceof DataView; },
    function (dw) { return { buffer: dw.buffer, byteOffset: dw.byteOffset, byteLength: dw.byteLength }; },
    function (obj) { return new DataView(obj.buffer, obj.byteOffset, obj.byteLength); }
];
