/* eslint-env node */
const fs = require('fs');
const path = require('path');

const prologue =
    // `//# sourceMappingURL=path/to/source.map
    // require("source-map-support").install();
`// This file is auto-generated from \`build.js\`
import Typeson from 'typeson';
`;
const epilogue = `export default Typeson;\n`;

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

const ws = fs.createWriteStream('index-es6.js');
ws.write(prologue);
const moduleStrings = {};
const dirs = ['types', 'presets'];
dirs.forEach(dir => {
    // While building the general file, we write the individual files too
    if (!fs.existsSync(`dist/${dir}`)) {
        fs.mkdirSync(`dist/${dir}`);
    }
    let currentLine = '';
    moduleStrings[dir] = '';
    ws.write(`\n// ${dir.toUpperCase()}\n`);
    fs.readdirSync(path.join(__dirname, '/', dir))
        .filter(f => f.lastIndexOf('.js') === f.length - '.js'.length)
        .forEach((f, i) => {
            const name = nameFromFile(f);
            let fileName = name; // `${name[0].toUpperCase() + name.slice(1)}`;
            let fileString = fileName;
            if (fileName === 'undef' && dir === 'presets') {
                fileName = 'undef2';
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
        });
    moduleStrings[dir] = moduleStrings[dir].slice(0, -1);
});
ws.write('\n');
dirs.forEach((dir) => {
    ws.write(
        `Typeson.${dir} = {
    ${moduleStrings[dir]}
};
`
    );
});
ws.end(epilogue);

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
