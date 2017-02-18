// TODO: We could check for `Symbol.for` methods here instead of
//     `__cloneEncapsulate` and `__cloneRevive` but relies on modern browsers

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

exports.cloneable = [
    function (x) {
        return x && typeof x === 'object' && typeof x.__cloneEncapsulate === 'function';
    },
    function (cloneable) {
        var encapsulated = cloneable.__cloneEncapsulate();
        var uuid = generateUUID();
        cloneableObjectsByUUID[uuid] = cloneable;
        return {uuid: uuid, encapsulated: encapsulated};
    },
    function (serializedClone) { return cloneableObjectsByUUID[serializedClone.uuid].__cloneRevive(serializedClone.encapsulated); }
];
