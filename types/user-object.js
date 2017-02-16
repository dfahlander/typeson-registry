var Typeson = require('typeson');
var getProto = Object.getPrototypeOf;

function isUserObject (val) {
    if (!val || Typeson.toStringTag(val) !== 'Object') {
        return false;
    }

    var proto = getProto(val);
    if (!proto) { // `Object.create(null)`
        return true;
    }
    return Typeson.hasConstructorOf(val, Object) || isUserObject(proto);
}

exports.userObjects = [
    function (x, stateObj) { return isUserObject(x); },
    function (n) { return Object.assign({}, n); },
    function (s) { return s;}
];
