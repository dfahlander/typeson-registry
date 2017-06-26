/* global shimIndexedDB */
/* eslint-disable no-var */
if (typeof global === 'undefined') {
    window.global = {};
}
(function () {
    'use strict';

    // Setup Mocha and Chai
    mocha.setup({ui: 'bdd', timeout: 5000});
    mocha.globals(['Typeson']);
    global.expect = window.expect = chai.expect;
    var describe = window.describe = global.describe || window.describe;
    global.assert = window.assert = chai.assert;

    /** Environment Info **/
    var env = window.env = global.env = {
        /**
         * Browser info
         * @type {browserInfo}
         */
        browser: getBrowserInfo()
    };

    /**
     * Intercept the first call to Mocha's `describe` function, and use it to initialize the test environment.
     */
    global.describe = window.describe = function (name, testSuite) {
        initTestEnvironment();
        mocha.checkLeaks();
        global.describe = window.describe = describe;
        describe.apply(global, arguments);
    };

    /**
     * Initializes the test environment, applying the shim if necessary.
     */
    function initTestEnvironment () {
        // Show which features the browser natively supports
        // getElementById('supports-XXXX').className += env.XXXX ? ' pass' : ' fail';
    }

    /**
     * Returns browser name and version
     * @returns {browserInfo}
     */
    function getBrowserInfo () {
        var userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        var offset;

        /** @name browserInfo **/
        var browserInfo = {
            name: '',
            version: '0',
            isMobile: false,
            isChrome: false,
            isIE: false,
            isFirefox: false,
            isSafari: false
        };

        if ((offset = userAgent.indexOf('Edge')) !== -1) {
            browserInfo.name = 'MSIE';
            browserInfo.version = userAgent.substring(offset + 5);
            browserInfo.isIE = true;
            browserInfo.isMobile = userAgent.indexOf('Windows Phone') !== -1;
        } else if ((offset = userAgent.indexOf('Chrome')) !== -1) {
            browserInfo.name = 'Chrome';
            browserInfo.version = userAgent.substring(offset + 7);
            browserInfo.isChrome = true;
        } else if ((offset = userAgent.indexOf('Firefox')) !== -1) {
            browserInfo.name = 'Firefox';
            browserInfo.version = userAgent.substring(offset + 8);
            browserInfo.isFirefox = true;
        } else if ((offset = userAgent.indexOf('MSIE')) !== -1) {
            browserInfo.name = 'MSIE';
            browserInfo.version = userAgent.substring(offset + 5);
            browserInfo.isIE = true;
            browserInfo.isMobile = userAgent.indexOf('Windows Phone') !== -1;
        } else if (userAgent.indexOf('Trident') !== -1) {
            browserInfo.name = 'MSIE';
            browserInfo.version = '11';
            browserInfo.isIE = true;
            browserInfo.isMobile = userAgent.indexOf('Windows Phone') !== -1;
        } else if ((offset = userAgent.indexOf('Safari')) !== -1) {
            browserInfo.name = 'Safari';
            browserInfo.isSafari = true;
            browserInfo.isMobile = userAgent.indexOf('Mobile Safari') !== -1;
            if ((offset = userAgent.indexOf('Version')) !== -1) {
                browserInfo.version = userAgent.substring(offset + 8);
            } else {
                browserInfo.version = userAgent.substring(offset + 7);
            }
        } else if ((offset = userAgent.indexOf('AppleWebKit')) !== -1) {
            browserInfo.name = 'Safari';
            browserInfo.version = userAgent.substring(offset + 12);
            browserInfo.isSafari = true;
            browserInfo.isMobile = userAgent.indexOf('Mobile Safari') !== -1;
        }

        if ((offset = browserInfo.version.indexOf(';')) !== -1 || (offset = browserInfo.version.indexOf(' ')) !== -1) {
            browserInfo.version = browserInfo.version.substring(0, offset);
        }

        browserInfo.version = parseFloat(browserInfo.version);

        return browserInfo;
    }

    /**
     * A "safe" wrapper around `document.getElementById`
     */
    function getElementById (id) {
        if (typeof document === 'undefined') {
            return {className: '', style: {}};
        }
        return document.getElementById(id) || {style: {}};
    }
})();
