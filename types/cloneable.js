import generateUUID from '../utils/generateUUID.js';

/**
 * @type {{[key: (symbol|string)]: any}}
 */
const cloneableObjectsByUUID = {};

/**
 * @type {import('typeson').TypeSpecSet}
 */
const cloneable = {
    cloneable: {
        test (x) {
            return x && typeof x === 'object' &&
                typeof x[Symbol.for('cloneEncapsulate')] === 'function';
        },
        replace (clonable) {
            const encapsulated = clonable[Symbol.for('cloneEncapsulate')]();
            const uuid = generateUUID();
            cloneableObjectsByUUID[uuid] = clonable;
            return {uuid, encapsulated};
        },
        revive (obj) {
            const {
                uuid, encapsulated
            } = /** @type {{uuid: string, encapsulated: any}} */ (obj);

            return cloneableObjectsByUUID[uuid][Symbol.for('cloneRevive')](
                encapsulated
            );
        }
    }
};

export default cloneable;
