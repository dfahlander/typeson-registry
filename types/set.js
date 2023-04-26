import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const set = {
    set: {
        test (x) { return toStringTag(x) === 'Set'; },
        replace (st) {
            return [...st.values()];
        },
        revive (values) {
            return new Set(values);
        }
    }
};

export default set;
