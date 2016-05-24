importScripts('require-runtime.js');

var Typeson = require('typeson');
var TSON = new Typeson().register(require('../presets/builtin'));

onmessage = function (ev) {
    console.log("Worker got: " + TSON.stringify(TSON.revive(ev.data)));
    postMessage(ev.data);
}

onerror = function (ev) {
    console.error ("Error: " + ev.target.error);
}
