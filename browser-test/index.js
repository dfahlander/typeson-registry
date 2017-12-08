/* globals Typeson */
// import Typeson from '../dist/index.js'; // Works in Chrome but we'll wait for other browser support

function log (msg) {
    console.log(msg);
    document.getElementById('log').textContent += msg + '\n';
}
const TSON = new Typeson().register(Typeson.presets.postMessage);

const worker = new Worker('worker.js');
worker.postMessage(TSON.encapsulate({
    a: NaN,
    b: Infinity,
    c: -Infinity,
    d: new Error('oops')
}));
worker.onmessage = function (ev) {
    if (typeof ev.data === 'string') {
        log(ev.data);
        return;
    }
    log('Got back: ' + ev.data.a);
    log('Got back: ' + ev.data.b);
    log('Got back: ' + ev.data.c);
    log('Main thread revival of original error is an `Error`: ' +
        (TSON.revive(ev.data).d instanceof Error));
};
