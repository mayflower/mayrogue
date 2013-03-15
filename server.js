var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    requirejs = require('requirejs');

requirejs.config({
   baseUrl: 'scripts'
});

var World = requirejs('world');

app.use(express.static(__dirname + '/frontend/'));
app.use('/scripts/', express.static(__dirname + '/scripts/'));

// setup environments
app.configure('development', function() {
    app.use(express.logger('dev'));
});

app.configure('production', function() {

});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

server.listen(3000);
