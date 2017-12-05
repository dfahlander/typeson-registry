/* globals Typeson */
/* eslint-env worker */
importScripts('../index.js');

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
