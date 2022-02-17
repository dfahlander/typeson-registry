import {isUserObject} from 'typeson';

const userObject = {
    userObject: {
        test (x, stateObj) { return isUserObject(x); },
        replace (n) { return {...n}; },
        revive (s) { return s; }
    }
};

export default userObject;
