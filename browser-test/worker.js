/* globals Typeson */
/* eslint-env worker */

// Todo: ES6 Modules import not yet supported in workers by Chrome
// import Typeson from '../dist/index.js';
importScripts('../dist/all.js');

const TSON = new Typeson().register(Typeson.presets.postMessage);

self.onmessage = function (ev) {
    const workerGot = 'Worker got: ' + TSON.stringify(TSON.revive(ev.data));
    const workerRevival = 'Worker revival of error is an `Error`: ' +
        (TSON.revive(ev.data).d instanceof Error);

    postMessage(workerGot);
    postMessage(workerRevival);
    postMessage(ev.data);
};

self.onerror = function (ev) {
    console.error('Error: ' + ev.target.error);
};
