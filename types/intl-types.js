import {hasConstructorOf} from 'typeson';

const IntlCollator = {
    test (x) { return hasConstructorOf(x, Intl.Collator); },
    replace (c) { return c.resolvedOptions(); },
    revive (options) { return new Intl.Collator(options.locale, options); }
};

const IntlDateTimeFormat = {
    test (x) { return hasConstructorOf(x, Intl.DateTimeFormat); },
    replace (dtf) { return dtf.resolvedOptions(); },
    revive (options) {
        return new Intl.DateTimeFormat(options.locale, options);
    }
};

const IntlNumberFormat = {
    test (x) { return hasConstructorOf(x, Intl.NumberFormat); },
    replace (nf) { return nf.resolvedOptions(); },
    revive (options) { return new Intl.NumberFormat(options.locale, options); }
};

const intlTypes = {
    IntlCollator,
    IntlDateTimeFormat,
    IntlNumberFormat
};

export default intlTypes;
