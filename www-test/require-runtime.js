var module = {exports: {}},
    exports = module.exports;
    
var require = typeof importScripts === 'function' ? function (x) {
    var origExports = exports;
    try {
        module.exports = exports = {};
        importScripts(x.indexOf('.') === 0 ? x + ".js" : x === 'typeson' ?
            '../node_modules/typeson/typeson.js' : x === 'base64-arraybuffer' ?
            '../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js' :
            '../node_modules/' + x + "/index.js");
        return module.exports;
    } finally {
        module.exports = exports = origExports;
    }
} : function (x) {
};
