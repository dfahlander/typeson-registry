var fs = require('fs');
var path = require('path');
var isWin = /^win/.test(process.platform);

function copy (fromPath, toPath) {
    fs.writeFileSync(toPath, fs.readFileSync(fromPath));
}

if (isWin) {
    var pathToGTKBin = 'C:\\GTK\\bin\\';
    var pathToIEShims = 'C:\\Program Files (x86)\\Internet Explorer\\IEShims.dll';
    var targetDir = path.join(require.resolve('canvas'), '../../build/Release');

    [pathToGTKBin, pathToIEShims, targetDir].forEach((path) => {
        if (!fs.existsSync(path)) {
            console.log('Could not find path: ' + path);
            process.exit(1);
        }
    });

    copy(pathToIEShims, targetDir + '\\IEShims.dll');

    fs.readdir(pathToGTKBin, function (err, files) {
        if (err) {
            console.error('Could not list the directory contents.', err);
            process.exit(1);
        }
        files.filter((f) => (/\.dll$/).test(f)).forEach((file) => {
            var targetPath = targetDir + '\\' + file;
            if (fs.existsSync(targetPath)) {
                console.log('File already exists at target path: ' + targetPath);
            } else {
                copy(pathToGTKBin + file, targetPath);
                console.log('Copied missing file to: ' + targetPath);
            }
        });
        console.log('Successfully installed Canvas files for Windows build.');
    });
} else {
    console.log('Windows not detected, so skipping Windows-specific (Canvas) installation steps');
}
