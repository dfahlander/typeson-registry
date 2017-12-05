const cloneableObjectsByUUID = {};

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
    cloneable: {
        test (x) {
            return x && typeof x === 'object' &&
                typeof x[Symbol.for('cloneEncapsulate')] === 'function';
        },
        replace (cloneable) {
            const encapsulated = cloneable[Symbol.for('cloneEncapsulate')]();
            const uuid = generateUUID();
            cloneableObjectsByUUID[uuid] = cloneable;
            return {uuid, encapsulated};
        },
        revive ({uuid, encapsulated}) {
            return cloneableObjectsByUUID[uuid][Symbol.for('cloneRevive')](encapsulated);
        }
    }
};
