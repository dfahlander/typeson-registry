import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const regexp = {
    regexp: {
        test (x) { return toStringTag(x) === 'RegExp'; },
        replace (rexp) {
            return {
                source: rexp.source,
                flags: (rexp.global ? 'g' : '') +
                    (rexp.ignoreCase ? 'i' : '') +
                    (rexp.multiline ? 'm' : '') +
                    (rexp.sticky ? 'y' : '') +
                    (rexp.unicode ? 'u' : '') +
                    (rexp.unicodeSets ? 'v' : '') +
                    (rexp.hasIndices ? 'd' : '') +
                    (rexp.dotAll ? 's' : '')
            };
        },
        revive ({source, flags}) { return new RegExp(source, flags); }
    }
};

export default regexp;
