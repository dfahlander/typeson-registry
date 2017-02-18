var fs = require('fs');
var path = require('path');
var mapstraction = require('mapstraction');
var uglifyify = require('uglifyify');
var browserifyString = require('browserify-string');
var browserify = require('browserify');
// var watchify = require('watchify');
var browserifyTest = require('browserify-test').default; // Babel doesn't handle without `babel-plugin-add-module-exports` and `browserify-test` is not using it (and `import` doesn't need to add it)
var babelify = require('babelify');

var prologue =
    // `//# sourceMappingURL=path/to/source.map
    // require("source-map-support").install();
`var Typeson;
if (Typeson === undefined) { Typeson = require('typeson'); }
Typeson.types = {};
Typeson.presets = {};
`;
var epilogue = `if (typeof module !== 'undefined') { module.exports = Typeson; }\n`;

var ws = fs.createWriteStream('index.js');
ws.write(prologue);
['types', 'presets'].forEach(dir => {
    fs.readdirSync(__dirname + '/' + dir)
        .filter(f => f.lastIndexOf('.js') === f.length - '.js'.length)
        .forEach(f => {
            var reqStr = `Typeson.${dir}.${nameFromFile(f)} = require('./${dir}/${f}');\n`;
            ws.write(reqStr);
            // While building the general file, we write the individual files too
            browserifyUglifyAndExtractMaps(prologue + reqStr + epilogue, `dist/${dir}/${f}`, browserifyString);
        });
});
ws.end(epilogue);

browserifyUglifyAndExtractMaps('index.js', 'dist/all.js').on('finish', () => {
    fs.unlink(path.join(process.cwd(), '.__browserify_string_empty.js'), function (err) {
        if (err) {
            console.log(err);
            return;
        }
        if (process.argv[2] === 'test') {
            browserifyTest({files: ['./test/test-entry.js'], transform: ['babelify'], watch: true});
        }
    });
});

function browserifyUglifyAndExtractMaps (entries, target, browserifyString) {
    var browserifyOptions = {
        standalone: 'Typeson',
        // detectGlobals: false, // Besides speeding up, avoids some apparent bug with modules referencing `global` getting added with double directories into `sources` of the source map (e.g., as `types/errors/errors` instead of `types/errors`)
        debug: true // Needed by mapstraction to extract source map
    };

    var browserifyInstance;
    if (browserifyString) {
        browserifyInstance = browserifyString(entries, browserifyOptions);
    } else {
        browserifyOptions.entries = entries;
        browserifyInstance = browserify(browserifyOptions);
    }
    var ret = browserifyInstance.transform({ global: true }, 'uglifyify'
    // ).plugin(babelify)
    ).plugin(
        mapstraction, {
            // sourcesBase: process.argv[2] === 'null' ? '' : (process.argv[2] || '../'), // Works
            // sourceRoot: process.argv[3] || '', // 'http://localhost:8085', // Can work in place of `sourcesBase`
            /*
            sourcesMap: function (sourceFile) { // Best solution as makes it fully independent of build
                return '../' + sourceFile;
            },
            */
            _: [target + '.map']
        }
    ).bundle().pipe(
        fs.createWriteStream(target)
    );
    return ret;
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
