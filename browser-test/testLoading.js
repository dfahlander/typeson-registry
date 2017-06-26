/* exported require */
/*global mocha, Typeson, ActiveXObject */
// helper to get all the test cases
'use strict';
var expect = chai.expect;
// stubs to load nodejs tests
function require (path) { // eslint-disable-line no-unused-vars
    if (path === 'mocha') {return mocha;}
    if (path.match(/^\.\.\/?$/)) {return Typeson;}

    var matches = path.match(/\.\.\/(types|presets)\/(.*?)(\.js)?$/);
    if (matches) {
        return Typeson[matches[1]][nameFromFile(matches[2] + '.js').join('')];
    }
}
function nameFromFile(f) {
    var name = f.substr(0, f.length -".js".length),
        dash;
    do {
        dash = name.indexOf('-');
        if (dash >= 0) {
            name = name.substr(0, dash) +
                name.substr(dash+1, 1).toUpperCase() +
                name.substr(dash+2);
        }
    } while (dash >= 0);
    return name.split('.');
}
var module = {exports: {}}; // eslint-disable-line no-unused-vars

// synchronous load function for JS code, uses XMLHttpRequest abstraction from
// http://www.quirksmode.org/js/xmlhttp.html
// Since the tests are written in node.js style we need to wrap their code into
// a function, otherwise they would pollute the global NS and interfere with each
// other
function get (url, callback) {
    function createXMLHTTPObject () {
        var i, XMLHttpFactories = [
          function () {return new XMLHttpRequest();},
          function () {return new ActiveXObject('Msxml2.XMLHTTP');},
          function () {return new ActiveXObject('Msxml3.XMLHTTP');},
          function () {return new ActiveXObject('Microsoft.XMLHTTP');}];
      for (i = 0; i < XMLHttpFactories.length; i++) {
        try {return XMLHttpFactories[i]();}
            catch (ignore) {}
        }
      return false;
    }
    function sendRequest (url, callback) {
      var req = createXMLHTTPObject();
      req.open('GET', url, false /* sync */);
      req.onreadystatechange = function () {if (req.readyState === 4) {callback(req);}};
      if (req.readyState !== 4) {req.send();}
    }
    sendRequest(url, callback);
}
function loadJS (url) {get(url, function (req) {new Function(req.responseText)();});} // eslint-disable-line no-unused-vars, no-new-func
