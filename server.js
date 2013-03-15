var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    requirejs = require('requirejs'),
    _ = require('underscore');

requirejs.config({
   baseUrl: 'scripts'
});

var World = requirejs('world');
var Tiles = requirejs('tiles');

app.use(express.static(__dirname + '/frontend/'));
app.use('/scripts/', express.static(__dirname + '/scripts/'));

// setup environments
app.configure('development', function() {
    app.use(express.logger('dev'));
});

app.configure('production', function() {

});

var entities = [];
_.times(20, function(index) {
   var shape;
   var x = Math.random();

   if (x < 0.3) {
      shape = Tiles.LICHKING;
   } else if (x < 0.6) {
      shape = Tiles.OGRE;
   } else {
      shape = Tiles.CTHULHU_GUY;
   }

   entities.push(new World.Entity({
      x: _.random(34),
      y: _.random(49),
      shape: shape,
      id: index + 1
   }));
});

var map = new World.RandomMap({
    width: 35,
    height: 40
});

io.sockets.on('connection', function (socket) {
    socket.emit('map', map.serialize());
    socket.emit('entities', _.map(entities, function(entity) {
       return entity.serialize();
    }));
});

server.listen(3000);
