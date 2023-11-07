import {isUserObject} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const userObject = {
    userObject: {
        test (x /* , stateObj */) { return isUserObject(x); },
        replace (n) { return {...n}; },
        revive (s) { return s; }
    }
};

export default userObject;
