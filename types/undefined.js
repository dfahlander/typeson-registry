// This does not preserve `undefined` in sparse arrays; see the `undefined` or `sparse-undefined` preset
var Typeson = require('typeson');
module.exports = {
    undefined: [
        function (x, stateObj) { return typeof x === 'undefined' && (stateObj.ownKeys || !('ownKeys' in stateObj)); },
        function (n) { return null; },
        function (s) { return new Typeson.Undefined();} // Will add `undefined` (returning `undefined` would instead avoid explicitly setting)
    ]
};
