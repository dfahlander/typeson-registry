import Typeson from 'typeson';
export default {
    date: {
        test (x) { return Typeson.toStringTag(x) === 'Date'; },
        replace (date) {
            const time = date.getTime();
            if (isNaN(time)) {
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
