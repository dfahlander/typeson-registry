importScripts("../node_modules/typeson/dist/typeson.js");
importScripts("../dist/presets/post-message.js");

var TSON = new Typeson().register(Typeson.presets.postMessage);

onmessage = function (ev) {
    console.log("Worker got: " + TSON.stringify(TSON.revive(ev.data)));
    console.log("Worker revival of error is an `Error`: " + (TSON.revive(ev.data).d instanceof Error));
    postMessage(ev.data);
};

onerror = function (ev) {
    console.error ("Error: " + ev.target.error);
};
