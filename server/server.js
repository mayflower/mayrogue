var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../frontend_prototype'));

// setup environments
app.configure('development', function() {
    app.use(express.logger('dev'));
});

app.configure('production', function() {

});

app.get('/foo', function(req, res) {
    res.send('foobar\n');
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

server.listen(3000);
