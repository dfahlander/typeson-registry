// Here we allow the exact same non-plain object, function, and symbol instances to
//  be resurrected (assuming the same session/environment); plain objects are
//  ignored by Typeson so not presently available and we consciously exclude arrays

const resurrectableObjectsByUUID = {};

// TODO: We could use `import generateUUID from 'uuid/v4';` (but it needs crypto library, etc.)
function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export default {
    resurrectable: {
        test (x) {
            return x &&
                !Array.isArray(x) &&
                ['object', 'function', 'symbol'].includes(typeof x);
        },
        replace (resurrectable) {
            const uuid = generateUUID();
            resurrectableObjectsByUUID[uuid] = resurrectable;
            return uuid;
        },
        revive (serializedResurrectable) {
            return resurrectableObjectsByUUID[serializedResurrectable];
        }
    }
};
