import {TypesonPromise, toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const cryptokey = {
    cryptokey: {
        test (x) {
            return toStringTag(x) === 'CryptoKey' && x.extractable;
        },
        replaceAsync (
            /** @type {CryptoKey} */
            key
        ) {
            return new TypesonPromise(async (resolve, reject) => {
                /** @type {JsonWebKey} */
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
        revive (obj) {
            const {
                jwk, algorithm, usages
            } = /**
              * @type {{
              *   jwk: JsonWebKey,
              *   algorithm: KeyAlgorithm,
              *   usages: KeyUsage[]
              * }}
              */ (obj);

            return crypto.subtle.importKey(
                'jwk', jwk, algorithm, true, usages
            );
        }
    }
};

export default cryptokey;
