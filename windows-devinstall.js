/* eslint-env node */
import fs from 'fs';
import path from 'path';
import util from 'util';

// Todo: Remove after engines supporting Node 11 (and use fs.promises instead)
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const isWin = process.platform.startsWith('win');

// Todo: Remove after engines supporting Node 7.6.0
/**
 *
 * @param {string} fromPath
 * @param {string} toPath
 * @throws {Error}
 * @returns {void}
 */
async function copy (fromPath, toPath) {
    let fileContents;
    try {
        fileContents = await readFile(fromPath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error('Could not find ' + fromPath);
        }
        throw err;
    }
    try {
        return writeFile(toPath, fileContents);
    } catch (err) {
        if (err.code === 'EEXIST') {
            throw new Error(
                'File already exists at target path: ' + toPath
            );
        }
        throw err;
    }
}

if (isWin) {
    const pathToGTKBin = 'C:\\GTK\\bin\\';
    const pathToIEShims =
        String.raw`C:\Program Files (x86)\Internet Explorer\IEShims.dll`;
    const targetDir = path.join(
        // eslint-disable-next-line no-undef
        require.resolve('canvas'), '../../build/Release'
    );

    await copy(pathToIEShims, targetDir + String.raw`\IEShims.dll`);

    let files;
    try {
        files = await readdir(pathToGTKBin);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error('Could not find ' + pathToGTKBin);
        }
        throw new Error('Could not list the directory contents.');
    }
    files.filter((f) => f.endsWith('.dll')).forEach(async (file) => {
        const targetPath = targetDir + '\\' + file;
        await copy(pathToGTKBin + file, targetPath);
        console.log('Copied missing file to: ' + targetPath);
    });
    console.log('Successfully installed Canvas files for Windows build.');
} else {
    console.log(
        'Windows not detected, so skipping Windows-specific (Canvas) ' +
        'installation steps'
    );
}
