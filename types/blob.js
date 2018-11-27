import Typeson from 'typeson';
import {string2arraybuffer} from '../utils/stringArrayBuffer.js';

export default {
    blob: {
        test (x) { return Typeson.toStringTag(x) === 'Blob'; },
        replace (b) { // Sync
            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', URL.createObjectURL(b), false); // Sync
            if (req.status !== 200 && req.status !== 0) {
                throw new Error('Bad Blob access: ' + req.status);
            }
            req.send();
            return {
                type: b.type,
                stringContents: req.responseText
            };
        },
        revive ({type, stringContents}) {
            return new Blob([string2arraybuffer(stringContents)], {type});
        },
        replaceAsync (b) {
            return new Typeson.Promise((resolve, reject) => {
                if (b.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                    reject(new Error('The Blob is closed'));
                    return;
                }
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    resolve({
                        type: b.type,
                        stringContents: reader.result
                    });
                });
                reader.addEventListener('error', () => {
                    reject(reader.error);
                });
                reader.readAsBinaryString(b);
            });
        }
    }
};
