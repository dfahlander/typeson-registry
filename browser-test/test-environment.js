import '../test/helpers/FileList.js';

export const imageTestFileNode =
    // browserify-test uses testem which assumes `cwd()` resolution
    //  (in `Config.prototype.resolvePath` of
    //  `node_modules/testem/lib/config.js`)
    '../test/helpers/Flag_of_the_United_Nations.png';

// Setup Mocha and Chai
mocha.setup({ui: 'bdd', timeout: 5000});
