import {toStringTag} from 'typeson';

/**
 * @template {{toJSON: () => string}} T
 * @param {string} name
 * @param {(json: string) => T} from
 * @returns {import('typeson').TypeSpecSet[string]}
 */
const buildSpec = (name, from) => {
    return {
        /**
         * @param {unknown} x
         * @returns {boolean}
         */
        test (x) { return toStringTag(x) === `Temporal.${name}`; },
        /**
         * @param {T} t
         * @returns {string}
         */
        replace (t) { return t.toJSON(); },
        /**
         * @param {string} json
         * @returns {T}
         */
        revive (json) { return from(json); }
    };
};

/**
 * @type {import('typeson').TypeSpecSet}
 */
const temporal = {
    temporalDuration: buildSpec(
        'Duration', (json) => Temporal.Duration.from(json)
    ),
    temporalInstant: buildSpec(
        'Instant', (json) => Temporal.Instant.from(json)
    ),
    temporalPlainDate: buildSpec(
        'PlainDate', (json) => Temporal.PlainDate.from(json)
    ),
    temporalPlainDateTime: buildSpec(
        'PlainDateTime', (json) => Temporal.PlainDateTime.from(json)
    ),
    temporalPlainMonthDay: buildSpec(
        'PlainMonthDay', (json) => Temporal.PlainMonthDay.from(json)
    ),
    temporalPlainTime: buildSpec(
        'PlainTime', (json) => Temporal.PlainTime.from(json)
    ),
    temporalPlainYearMonth: buildSpec(
        'PlainYearMonth', (json) => Temporal.PlainYearMonth.from(json)
    ),
    temporalZonedDateTime: buildSpec(
        'ZonedDateTime', (json) => Temporal.ZonedDateTime.from(json)
    )
};

export default temporal;
