/* globals crypto */
import Typeson from 'typeson';

const cryptokey = {
    cryptokey: {
        test (x) {
            return Typeson.toStringTag(x) === 'CryptoKey' && x.extractable;
        },
        replaceAsync (key) {
            return new Typeson.Promise(async (resolve, reject) => {
                let jwk;
                try {
                    jwk = await crypto.subtle.exportKey('jwk', key);
                // istanbul ignore next
                } catch (err) {
                    // eslint-disable-next-line max-len
                    // istanbul ignore next -- Our format should be valid and our key extractable
                    reject(err);
                    // istanbul ignore next
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
