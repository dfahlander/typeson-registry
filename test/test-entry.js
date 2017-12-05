/* eslint-env node */
if (typeof global === 'undefined') {
    global = window; // eslint-disable-line no-global-assign
}
global.chai = window.chai = require('chai');

global.Typeson = window.Typeson = require('typeson');
// var Typeson = require('../dist/all.js');

(function () {
require('./test-environment.js');

var tests; // eslint-disable-line no-var

if (process.env.npm_config_test) {
    tests = [process.env.npm_config_test];
    console.log('Running test: ' + process.env.npm_config_test);
} else {
    tests = [
        'test.js'
    ];
}
tests.forEach(function (path) {
    require('./test-polyglot.js');
});
}());
