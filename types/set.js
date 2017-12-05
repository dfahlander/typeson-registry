import Typeson from 'typeson';
export default {
    set: {
        test (x) { return Typeson.toStringTag(x) === 'Set'; },
        replace (set) { return Array.from(set.values()); },
        revive (values) { return new Set(values); }
    }
};
