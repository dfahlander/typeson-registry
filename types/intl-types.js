var Typeson = require('typeson');
exports["Intl.Collator"] = [
    function (x) { return Typeson.hasConstructorOf(x, Intl.Collator); },
    function (c) { return c.resolvedOptions(); },
    function (options) { return new Intl.Collator(options.locale, options); }
];

exports["Intl.DateTimeFormat"] = [
    function (x) { return Typeson.hasConstructorOf(x, Intl.DateTimeFormat); },
    function (dtf) { return dtf.resolvedOptions(); },
    function (options) { return new Intl.DateTimeFormat(options.locale, options); }
];

exports["Intl.NumberFormat"] = [
    function (x) { return Typeson.hasConstructorOf(x, Intl.NumberFormat); },
    function (nf) { return nf.resolvedOptions(); },
    function (options) { return new Intl.NumberFormat(options.locale, options); }
];
