import Typeson from 'typeson';

export default {
    userObject: {
        test (x, stateObj) { return Typeson.isUserObject(x); },
        replace (n) { return Object.assign({}, n); },
        revive (s) { return s; }
    }
};
