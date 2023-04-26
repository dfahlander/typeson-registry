/* eslint-env node */
/* eslint-disable no-console */
import fs from 'fs';
import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import util from 'util';

import {rollup} from 'rollup';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

// fs.promises is not available until Node 11 (and need for URL until 10.0.0)

const __dirname = dirname(fileURLToPath(import.meta.url));

const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);

const prologue =
// Todo: Integrate source-map-support?
// `//# sourceMappingURL (break from next line as nyc --all will otherwise
//   try to read)
//                       =path/to/source.map
// require("source-map-support").install();
`// This file is auto-generated from \`build.js\`
`;
const epilogue = "export * from 'typeson';\n";

const ws = fs.createWriteStream('index.js');
ws.write(prologue);
const moduleStrings = {};

try {
    await mkdir('dist');
} catch (err) {
    if (err.code !== 'EEXIST') {
        throw err;
    }
}

const dirs = ['types', 'presets'];
const dirsOutput = await Promise.all(dirs.map(async (dir) => {
    // While building the general file, we write the individual files too
    try {
        await mkdir(`dist/${dir}`);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    let currentLine = '    ';
    moduleStrings[dir] = '';
    const dirPath = join(__dirname, '/', dir);
    // Todo: Would be faster to `Promise.all` on concatenation of all
    const promiseAll = await Promise.all((await readdir(dirPath))
        .filter((f) => f.endsWith('.js'))
        .map((f, i) => {
            const name = nameFromFile(f);
            let fileName = name; // `${name[0].toUpperCase() + name.slice(1)}`;
            let fileString = fileName;

            // Todo: We really should auto-detect duplicates instead
            if (['undef'].includes(fileName) && dir === 'presets') {
                fileName += 'Preset';
                fileString = fileName;
            }
            let currentAddition;
            const wouldbeLength =
                currentLine.length + // Previously existing line length adjusted
                (i === 0 ? 0 : 1) + // space
                fileString.length +
                1; // comma
            const maxWidth = 80;
            // Shouldn't be adding more than 80 chars
            if (wouldbeLength / maxWidth > 1) {
                moduleStrings[dir] += '\n';
                currentLine = currentAddition = `    ${fileString},`;
            } else {
                currentAddition = (i === 0 ? '' : ' ') + `${fileString},`;
                currentLine += currentAddition;
            }
            moduleStrings[dir] += currentAddition;

            let reqStr = `import ${fileName} from './${dir}/${f}';\n`;
            if (reqStr.length >= maxWidth) {
                reqStr = `import ${fileName} from\n    './${dir}/${f}';\n`;
            }
            bundle({
                name,
                input: join(dirPath, f),
                output: `./dist/${dir}/${f.replace(/\.js$/u, '.umd.js')}`
            });
            return reqStr;
        }));
    moduleStrings[dir] = moduleStrings[dir].slice(0, -1);
    return promiseAll;
}));

dirs.forEach((dir, i) => {
    ws.write(`\n// ${dir.toUpperCase()}\n`);
    ws.write(dirsOutput[i].join(''));
});
dirs.forEach((dir) => {
    ws.write(
        `\n/* ${dir} */\nexport {
    ${moduleStrings[dir]}
};\n`
    );
});
ws.write('\n');
ws.end(epilogue);

ws.on('finish', async () => {
    await Promise.all([
        bundle({
            name: 'TypesonNamespace',
            input: 'index.js',
            output: './dist/index.umd.min.js'
        }),
        bundle({
            name: 'TypesonNamespace',
            input: 'index.js',
            output: './dist/index.umd.js',
            minified: false
        }),
        bundle({
            input: 'index.js',
            output: './dist/index.min.js',
            format: 'es'
        }),
        bundle({
            input: 'index.js',
            output: './dist/index.js',
            format: 'es',
            minified: false
        }),
        bundle({
            input: 'polyfills/createObjectURL.js',
            output: 'polyfills/createObjectURL.umd.js',
            name: 'createObjectURL'
        })

    ]);
    console.log('Finished build');
});

/**
* @external RollupOutput
* @see https://github.com/rollup/rollup/blob/master/src/rollup/types.d.ts#L478
*/

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.input
 * @param {string} cfg.output
 * @param {string} cfg.name
 * @param {string} [cfg.format="umd"]
 * @param {boolean} [cfg.minified=true]
 * @returns {Promise<RollupOutput[]>}
 */
async function bundle ({input, output, name, format = 'umd', minified = true}) {
    const plugins = [
        nodeResolve({
            mainFields: ['module']
        }),
        commonjs(),
        ...(
            minified
                ? [terser({
                    // Needed for typeson's `Undefined` and other
                    //   constructor detection
                    keep_fnames: true,
                    // Keep in case implementing above as classes
                    keep_classnames: true
                })]
                : []
        )

    ];
    if (format !== 'es') {
        plugins.unshift(babel({
            babelHelpers: 'bundled',
            // This was otherwise not picking up `.babelrc` for some reason
            presets: [
                ['@babel/env', {
                    targets: 'cover 100%'
                }]
            ]
        }));
    }

    // Todo: Setup rollup.watch() dev routine
    const bndle = await rollup({
        input,
        plugins
    });
    // const {imports, exports, modules} = bundle;
    // console.log(Object.keys(imports), exports, Object.keys(modules));
    try {
        return bndle.write({
            file: output,
            format,
            name,
            sourcemap: true
        });
    } catch (err) {
        console.log('error writing bundle:', output, err);
    }
    return undefined;
}

/**
 *
 * @param {string} f
 * @returns {string}
 */
function nameFromFile (f) {
    let name = f.slice(0, f.length - '.js'.length);
    let dash;
    do {
        dash = name.indexOf('-');
        if (dash >= 0) {
            name = name.slice(0, dash) +
                name.slice(dash + 1, dash + 2).toUpperCase() +
                name.slice(dash + 2);
        }
    } while (dash >= 0);
    return name.split('.')[0];
}
