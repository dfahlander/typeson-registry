import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const date = {
    date: {
        test (x) { return toStringTag(x) === 'Date'; },
        replace (dt) {
            const time = dt.getTime();
            return Number.isNaN(time) ? 'NaN' : time;
        },
        revive (time) {
            return new Date(time === 'NaN' ? NaN : time);
        }
    }
};

export default date;
