import {TypesonPromise, toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const promise = {
    promise: {
        test (x) {
            return toStringTag(x) === 'Promise';
        },
        replaceAsync (prom) {
            return new TypesonPromise(async (resolve) => {
                try {
                    resolve({
                        value: await prom
                    });
                } catch (error) {
                    resolve({
                        error
                    });
                }
            });
        },
        revive (o) {
            return o.error
                ? Promise.reject(o.error)
                : Promise.resolve(o.value);
        }
    }
};

export default promise;
