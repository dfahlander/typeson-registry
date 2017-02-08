var webpack = require("webpack");
var fs = require('fs');
["types", "presets"].forEach(dir => {
    fs.readdirSync(__dirname + "/" + dir)
        .filter(f => f.lastIndexOf('.js') === f.length - '.js'.length)
        .forEach(f => {
            webpack ({
                entry: __dirname + "/" + dir + "/" + f,
                output: {
                    libraryTarget: "umd",
                    library: ["Typeson", dir].concat(nameFromFile(f)),
                    filename: __dirname + "/dist/" + dir + "/" + f
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin()
                ],
                devtool: 'source-map'
            }, err => {
                err && console.error (err);
            });
        });
});

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

//files.forEach(f => console.log(f));
