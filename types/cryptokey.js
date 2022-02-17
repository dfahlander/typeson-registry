/* globals crypto */
import {TypesonPromise, toStringTag} from 'typeson';

const cryptokey = {
    cryptokey: {
        test (x) {
            return toStringTag(x) === 'CryptoKey' && x.extractable;
        },
        replaceAsync (key) {
            return new TypesonPromise(async (resolve, reject) => {
                let jwk;
                try {
                    jwk = await crypto.subtle.exportKey('jwk', key);
                // Our format should be valid and our key extractable
                /* c8 ignore next 4 */
                } catch (err) {
                    reject(err);
                    return;
                }
                resolve({
                    jwk,
                    algorithm: key.algorithm,
                    usages: key.usages
                });
            });
        },
        revive ({jwk, algorithm, usages}) {
            return crypto.subtle.importKey('jwk', jwk, algorithm, true, usages);
        }
    }
};

export default cryptokey;
