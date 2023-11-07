/* globals TypesonNamespace */
/* eslint-env worker */

// Todo: ES6 Modules import not yet supported in workers by Chrome
// import {Typeson, postmessage} from '../dist/index.js';
importScripts('../dist/index.umd.cjs');

const TSON = new TypesonNamespace.Typeson().register(
    TypesonNamespace.postmessage
);

self.addEventListener('message', function (ev) {
    const workerGot = 'Worker got: ' + TSON.stringify(TSON.revive(ev.data));
    const workerRevival = 'Worker revival of error is an `Error`: ' +
        // eslint-disable-next-line no-restricted-syntax
        (TSON.revive(ev.data).d instanceof Error);

    postMessage(workerGot);
    postMessage(workerRevival);
    postMessage(ev.data);
});

self.addEventListener('error', function (ev) {
    console.error('Error: ' + ev.target.error);
});
