import {toStringTag} from 'typeson';

const map = {
    map: {
        test (x) { return toStringTag(x) === 'Map'; },
        replace (mp) { return [...mp.entries()]; },
        revive (entries) { return new Map(entries); }
    }
};

export default map;
