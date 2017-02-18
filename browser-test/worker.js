importScripts("../dist/presets/post-message.js");

var TSON = new Typeson().register(Typeson.presets.postMessage);

onmessage = function (ev) {
    var workerGot = "Worker got: " + TSON.stringify(TSON.revive(ev.data));
    var workerRevival = "Worker revival of error is an `Error`: " + (TSON.revive(ev.data).d instanceof Error);

    postMessage(workerGot);
    postMessage(workerRevival);
    postMessage(ev.data);
};

onerror = function (ev) {
    console.error ("Error: " + ev.target.error);
};
