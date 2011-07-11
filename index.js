// Include modules
var config = require('./lib/config'),
    adapter = require("./lib/redis-adapter"),
    express = require('express'),
    app = express.createServer();

// Middleware
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

// Api
app.post('/api', function(req, res, next){

    var response = { 
        longUrl: req.param('longUrl') || ''
    }

    res.contentType('application/json');

    if(isUrl(response.longUrl)){
        adapter.shorten(response.longUrl, function(reply) {
            if(reply) {
                response.shortUrl = reply;
                res.send(response);
            }
        });
    } else {
        response.error = 'Incorrect url';
        res.send(response);
    }

});


// Index
app.get('/:link', function(req, res){
    
    if(req.params.link) {
        adapter.expand(req.params.link, function(reply) {
            if(reply) {
                res.redirect(reply, 301);
            } else {
                res.redirect('/');
            }
        });
    } 
    
});

// Url validator
function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

app.listen(config.port, config.host);

console.log('Server running at http://' + config.host + ':' + config.port + '/');