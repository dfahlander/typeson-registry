import Typeson from 'typeson';

import {string2arraybuffer} from '../utils/stringArrayBuffer.js';

export default {
    file: {
        test (x) { return Typeson.toStringTag(x) === 'File'; },
        replace (f) { // Sync
            const req = new XMLHttpRequest();
            req.open('GET', URL.createObjectURL(f), false); // Sync
            if (typeof TextEncoder !== 'undefined') { // Using TextDecoder/TextEncoder used too much space
                req.overrideMimeType('text/plain; charset=utf-16le');
            }
            if (req.status !== 200 && req.status !== 0) {
                throw new Error('Bad Blob access: ' + req.status);
            }
            req.send();
            return {
                type: f.type,
                stringContents: req.responseText,
                name: f.name,
                lastModified: f.lastModified
            };
        },
        revive ({name, type, stringContents, lastModified}) {
            // stringContents = new TextEncoder().encode(stringContents);
            const buffer = string2arraybuffer(stringContents);
            // stringContents = new TextDecoder('utf-16le').decode(buffer);
            return new File([buffer], name, {
                type,
                lastModified
            });
        },
        replaceAsync (f) {
            return new Typeson.Promise(function (resolve, reject) {
                if (f.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                    reject(new Error('The File is closed'));
                    return;
                }
                const reader = new FileReader();
                reader.addEventListener('load', function () {
                    resolve({
                        type: f.type,
                        stringContents: reader.result,
                        name: f.name,
                        lastModified: f.lastModified
                    });
                });
                reader.addEventListener('error', function () {
                    reject(reader.error);
                });
                reader.readAsText(f, 'UTF-16');
            });
        }
    }
};
