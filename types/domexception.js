import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const domexception = {
    domexception: {
        test (x) { return toStringTag(x) === 'DOMException'; },
        replace (de) {
            // `code` is based on `name` and readonly, so no
            //   need to keep here
            return {
                name: de.name,
                message: de.message
            };
        },
        revive ({message, name}) {
            return new DOMException(message, name);
        }
    }
};

export default domexception;
