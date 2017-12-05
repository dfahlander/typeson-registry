import Typeson from 'typeson';
export default {
    map: {
        test (x) { return Typeson.toStringTag(x) === 'Map'; },
        replace (map) { return Array.from(map.entries()); },
        revive (entries) { return new Map(entries); }
    }
};
