require('http').createServer(function (req, res) {
    var extra = req.url === '/browser-test/' ? 'index.html' : '';
    if ((/\.css$/).test(req.url)) {
        res.setHeader('Content-Type', 'text/css');
    }
    var s = require('fs').createReadStream(((/\.\.\//).test(req.url) ? '' : '.') + req.url + extra);
    s.pipe(res);
    s.on('error', function () {});
}).listen(8085);
console.log('Started server; open http://localhost:8085/browser-test/index.html or http://localhost:8085/browser-test/worker.html in the browser');
