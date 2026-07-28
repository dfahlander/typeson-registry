import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const map = {
    map: {
        test (x) { return toStringTag(x) === 'Map'; },
        replace (mp) { return mp.entries().toArray(); },
        revive (entries) { return new Map(entries); }
    }
};

export default map;
