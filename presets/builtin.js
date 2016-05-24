/* This preset includes types that are built-in into the javascript language itself, this
   should work universally. Types that where added in ES6 or beyond will be checked before included
   so that this module can be consumed by both ES5 and ES6 environments.
   Some types cannot be encapsulated because their inner state is private: WeakMap, WeakSet.
   The Function type is not included because their closures would not be serialized, so a revived
   Function that uses closures would not behave as expected.
*/
module.exports = [
    // ES5
    require('../types/primitive-objects'),
    require('../types/special-numbers'),
    require('../types/date'),
    require('../types/error'),
    require('../types/errors'),
    require('../types/regexp'),
    // ES2015 (ES6)
    typeof Map === 'function' && require('../types/map'),
    typeof Set === 'function' && require('../types/set'),
    typeof ArrayBuffer === 'function' && require('../types/arraybuffer'),
    typeof Uint8Array === 'function' && require('../types/typed-arrays'),
    typeof DataView === 'function' && require('../types/dataview'),
    typeof Intl !== 'undefined' && require('../types/intl-types')
];
