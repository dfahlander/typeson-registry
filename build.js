/* eslint-env node */
const fs = require('fs');
const path = require('path');

const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

const {terser} = require('rollup-plugin-terser');

const prologue =
// Todo: Integrate source-map-support?
// `//# sourceMappingURL=path/to/source.map
// require("source-map-support").install();
`// This file is auto-generated from \`build.js\`
import Typeson from 'typeson';
`;
const epilogue = `export default Typeson;\n`;

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

const ws = fs.createWriteStream('index.js');
ws.write(prologue);
const moduleStrings = {};

(async () => { // eslint-disable-line padded-blocks

const dirs = ['types', 'presets'];
await Promise.all(dirs.map(async dir => {
    // While building the general file, we write the individual files too
    if (!fs.existsSync(`dist/${dir}`)) {
        fs.mkdirSync(`dist/${dir}`);
    }
    let currentLine = '';
    moduleStrings[dir] = '';
    ws.write(`\n// ${dir.toUpperCase()}\n`);
    const dirPath = path.join(__dirname, '/', dir);
    // Todo: Would be faster to Promise.all on concatenation of all
    const promiseAll = await Promise.all(fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.js'))
        .map((f, i) => {
            const name = nameFromFile(f);
            let fileName = name; // `${name[0].toUpperCase() + name.slice(1)}`;
            let fileString = fileName;

            // Todo: We really should auto-detect duplicates instead
            if (['undef'].includes(fileName) && dir === 'presets') {
                fileName += '2';
                fileString += ': ' + fileName;
            }
            /*
            if (['Infinity', 'NaN', 'undefined'].includes(fileName)) {
                fileName = `${dir.slice(0, -1)}${fileName.charAt().toUpperCase() + fileName.slice(1)}`;
                fileString += ': ' + fileName;
            }
            */
            let currentAddition;
            const wouldbeLength =
                currentLine.length + // Previously existing line length adjusted
                (i === 0 ? 0 : 1) + // space
                fileString.length +
                1; // comma
            if (wouldbeLength / 80 > 1) { // Shouldn't be adding more than 80 chars
                moduleStrings[dir] += '\n';
                currentLine = currentAddition = `    ${fileString},`;
            } else {
                currentAddition = (i === 0 ? '' : ' ') + `${fileString},`;
                currentLine += currentAddition;
            }
            moduleStrings[dir] += currentAddition;

            const reqStr = `import ${fileName} from './${dir}/${f}';\n`;
            ws.write(reqStr);
            return bundle({
                name: `Typeson.${dir}.${name}`,
                input: path.join(dirPath, f),
                output: `./dist/${dir}/${f}`
            });
        })
    );
    moduleStrings[dir] = moduleStrings[dir].slice(0, -1);
    return promiseAll;
}));

dirs.forEach((dir) => {
    ws.write(
        `\nTypeson.${dir} = {
    ${moduleStrings[dir]}
};`
    );
});
ws.write('\n\n');
ws.end(epilogue);

ws.on('finish', async () => {
    await Promise.all([
        bundle({input: 'index.js', output: './dist/all.js', name: 'Typeson'}),
        bundle({input: 'index.js', output: './dist/index.js', name: 'Typeson', format: 'es'}),

        bundle({input: 'test/test.js', output: 'test/test-polyglot.js', name: 'TypesonTest'}),
        bundle({
            input: 'polyfills/createObjectURL.js',
            output: 'polyfills/createObjectURL-polyglot.js',
            name: 'createObjectURL'
        })
    ]);
    console.log('Finished build');
});
})();

async function bundle ({input, output, name, format = 'umd'}) {
    const plugins = [
        input.includes('test') ? null : terser({
            keep_fnames: true, // Needed for `Typeson.Undefined` and other constructor detection
            keep_classnames: true // Keep in case implementing above as classes
        }),
        resolve({
            main: false
        })
    ];
    if (format !== 'es') {
        plugins.unshift(babel({
            // This was otherwise not picking up `.babelrc` for some reason
            presets: [
                ['@babel/env', {
                    targets: 'cover 100%'
                }]
            ]
        }));
    }

    // Todo: Setup rollup.watch() dev routine
    const bundle = await rollup.rollup({
        input,
        plugins
    });
    // const {imports, exports, modules} = bundle;
    // console.log('imports/exports/modules', Object.keys(imports), exports, Object.keys(modules));
    try {
        return bundle.write({
            file: output,
            format,
            name,
            sourcemap: true
        });
    } catch (err) {
        console.log('error writing bundle: ', output, err);
    }
};

function nameFromFile (f) {
    let name = f.substr(0, f.length - '.js'.length);
    let dash;
    do {
        dash = name.indexOf('-');
        if (dash >= 0) {
            name = name.substr(0, dash) +
                name.substr(dash + 1, 1).toUpperCase() +
                name.substr(dash + 2);
        }
    } while (dash >= 0);
    return name.split('.')[0];
}
