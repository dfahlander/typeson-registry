import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const date = {
    date: {
        test (x) { return toStringTag(x) === 'Date'; },
        replace (dt) {
            const time = dt.getTime();
            if (Number.isNaN(time)) {
                return 'NaN';
            }
            return time;
        },
        revive (time) {
            if (time === 'NaN') {
                return new Date(NaN);
            }
            return new Date(time);
        }
    }
};

export default date;
