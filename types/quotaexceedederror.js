import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const quotaexceedederror = {
    quotaexceedederror: {
        test (x) { return toStringTag(x) === 'QuotaExceededError'; },
        replace ({message, quota, requested}) {
            return {message, quota, requested};
        },
        revive ({message, quota, requested}) {
            /** @type {{quota?: number, requested?: number}} */
            const options = {};
            if (quota !== null && quota !== undefined) {
                options.quota = quota;
            }
            if (requested !== null && requested !== undefined) {
                options.requested = requested;
            }
            return new QuotaExceededError(message, options);
        }
    }
};

export default quotaexceedederror;
