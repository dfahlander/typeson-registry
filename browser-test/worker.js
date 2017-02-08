importScripts("../node_modules/typeson/dist/typeson.js");
importScripts("../dist/presets/post-message.js");

var TSON = new Typeson().register(Typeson.presets.postMessage);

onmessage = function (ev) {
    console.log("Worker got: " + TSON.stringify(TSON.revive(ev.data)));
    postMessage(ev.data);
};

onerror = function (ev) {
    console.error ("Error: " + ev.target.error);
};
