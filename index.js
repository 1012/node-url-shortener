var http = require("http"),
    url = require("url"),
    fs = require('fs'),
    adapter = require("./redis-adapter");

http.createServer(function(request, response) {
    var path = url.parse(request.url, true);

    // Shorten link
    if ('query' in path && 'url' in path.query) {

        adapter.shorten(path.query.url, function(reply) {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(reply);
            response.end();
        });

    // Expand link
    } else if ((/^\/[0-9a-z]+$/).test(path.pathname)) {

        adapter.expand(path.pathname.slice(1), function(reply) {
            if(reply) {
                response.writeHead(302, {'Location': reply});
                response.end();
            } else {
                response.writeHead(404, {});
                response.end();
            }
        });

    // Index
    } else {

        response.writeHead(200, {'Content-Type': 'text/plain'});

        fs.readFile('./templates/template.html', function (err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });

    }


}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');