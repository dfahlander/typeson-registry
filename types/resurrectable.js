// Here we allow the exact same non-plain object, function, and symbol instances to be resurrected (assuming the same session/environment); plain objects are ignored by Typeson so not presently available and we consciously exclude arrays

// TODO: We could use `var generateUUID = require('uuid/v4');`
function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

var cloneableObjectsByUUID = {};

exports.resurrectable = [
    function (x) {
        return x && !Array.isArray(x) && (typeof x === 'object' || typeof x === 'function' || typeof x === 'symbol');
    },
    function (resurrectable) {
        var uuid = generateUUID();
        cloneableObjectsByUUID[uuid] = resurrectable;
        return uuid;
    },
    function (serializedResurrectable) { return cloneableObjectsByUUID[serializedResurrectable]; }
];
