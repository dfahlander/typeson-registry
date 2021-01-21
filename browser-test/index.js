/* eslint-env browser */
import Typeson from '../dist/index.js';

/**
 *
 * @param {string} msg
 * @returns {void}
 */
function log (msg) {
    console.log(msg);
    // eslint-disable-next-line compat/compat
    document.querySelector('#log').textContent += msg + '\n';
}
const TSON = new Typeson().register(Typeson.presets.postmessage);

const worker = new Worker('worker.js');
worker.postMessage(TSON.encapsulate({
    a: Number.NaN,
    b: Number.POSITIVE_INFINITY,
    c: Number.NEGATIVE_INFINITY,
    d: new Error('oops')
}));
worker.addEventListener('message', function (ev) {
    if (typeof ev.data === 'string') {
        log(ev.data);
        return;
    }
    log('Got back: ' + ev.data.a);
    log('Got back: ' + ev.data.b);
    log('Got back: ' + ev.data.c);
    log('Main thread revival of original error is an `Error`: ' +
        // eslint-disable-next-line no-restricted-syntax
        (TSON.revive(ev.data).d instanceof Error));
});
