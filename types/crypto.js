import Typeson from 'typeson';

const crypto = {
    cryptokey: {
        test (x) {
            return Typeson.toStringTag(x) === 'CryptoKey' && x.extractable;
        },
        async replaceAsync (key) {
            const jwk = await crypto.subtle.exportKey('jwk', key);
            return {
                jwk,
                algorithm: key.algorithm,
                usages: key.usages
            };
        },
        reviveAsync ({jwk, algorithm, usages}) {
            return crypto.subtle.importKey('jwk', jwk, algorithm, true, usages);
        }
    }
};

export default crypto;
