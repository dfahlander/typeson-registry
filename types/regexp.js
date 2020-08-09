import Typeson from 'typeson';

const regexp = {
    regexp: {
        test (x) { return Typeson.toStringTag(x) === 'RegExp'; },
        replace (rexp) {
            return {
                source: rexp.source,
                flags: rexp.flags,
                lastIndex: rexp.lastIndex
            };
        },
        revive ({source, flags, lastIndex}) {
            const rexp = new RegExp(source, flags);
            rexp.lastIndex = lastIndex || 0;
            return rexp;
        }
    }
};

export default regexp;
