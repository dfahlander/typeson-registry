/* This preset includes types for the Structured Cloning Algorithm. */
module.exports = [
    // Todo: Might also register `ImageBitmap` and synchronous `Blob`/`File`/`FileList`
    // ES5
    require('../types/user-object'), // Processed last
    require('../presets/undefined'),
    require('../types/primitive-objects'),
    require('../types/special-numbers'),
    require('../types/date'),
    require('../types/regexp'),
    // ES2015 (ES6)
    typeof Map === 'function' && require('../types/map'),
    typeof Set === 'function' && require('../types/set'),
    typeof ArrayBuffer === 'function' && require('../types/arraybuffer'),
    typeof Uint8Array === 'function' && require('../types/typed-arrays'),
    typeof DataView === 'function' && require('../types/dataview'),
    typeof Intl !== 'undefined' && require('../types/intl-types'),
    // Non-built-ins
    require('../types/imagedata'),
    require('../types/imagebitmap'), // Async return
    require('../types/file'),
    require('../types/filelist'),
    require('../types/blob')
];
