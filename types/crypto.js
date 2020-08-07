import Typeson from "typeson";

const crypto = {
    cryptokey: {
        test(x) {
            return Typeson.toStringTag(x) === "CryptoKey" && x.extractable;
        },
        replaceAsync(key) {
            return crypto.subtle.exportKey("jwk", key).then(jwk => ({
                jwk,
                algorithm: key.algorithm,
                usages: key.usages
            }));
        },
        reviveAsync({ jwk, algorithm, usages }) {
            return crypto.subtle.importKey("jwk", jwk, algorithm, true, usages);
        }
    }
};

export default crypto;
