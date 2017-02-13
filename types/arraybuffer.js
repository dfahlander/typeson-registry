var Typeson = require('typeson');
var B64 = require ('base64-arraybuffer');

exports.ArrayBuffer = [
    function test (x) { return Typeson.toStringTag(x) === 'ArrayBuffer';},
    function encapsulate (b) { return B64.encode(b); },
    function revive (b64) { return B64.decode(b64); }
];
// See also typed-arrays!
