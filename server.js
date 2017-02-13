require('http').createServer(function (req, res) {
    var extra = req.url === '/test/' ? 'index.html' : '';
    var s = require('fs').createReadStream('.' + req.url + extra);
    s.pipe(res);
    s.on('error', function () {});
}).listen(8085);
console.log('Started server; open http://localhost:8085/browser-test/worker.html in the browser');
