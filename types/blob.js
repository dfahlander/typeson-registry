/* globals XMLHttpRequest, FileReader */
import {TypesonPromise, toStringTag} from 'typeson';
import {
    string2arraybuffer, arraybuffer2string
} from '../utils/stringArrayBuffer.js';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const blob = {
    blob: {
        test (x) { return toStringTag(x) === 'Blob'; },
        replace (b) { // Sync
            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', URL.createObjectURL(b), false); // Sync
            req.send();

            // Seems not feasible to accurately simulate
            /* c8 ignore next 3 */
            if (req.status !== 200 && req.status !== 0) {
                throw new Error('Bad Blob access: ' + req.status);
            }
            return {
                type: b.type,
                stringContents: req.responseText
            };
        },
        revive (obj) {
            const {
                type, stringContents
            } = /** @type {{type: string, stringContents: string}} */ (obj);
            return new Blob([string2arraybuffer(stringContents)], {type});
        },
        replaceAsync (b) {
            return new TypesonPromise((resolve, reject) => {
                /*
                if (b.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                    reject(new Error('The Blob is closed'));
                    return;
                }
                */
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    resolve({
                        type: b.type,
                        stringContents: arraybuffer2string(
                            /** @type {ArrayBuffer} */ (reader.result)
                        )
                    });
                });
                // Seems not feasible to accurately simulate
                /* c8 ignore next 3 */
                reader.addEventListener('error', () => {
                    reject(reader.error);
                });
                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line unicorn/prefer-blob-reading-methods -- Too new?
                reader.readAsArrayBuffer(b);
            });
        }
    }
};

export default blob;
