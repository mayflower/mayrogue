var requirejs = require('requirejs');
requirejs.config({
   baseUrl: 'scripts'
});

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    Maker = require('./server/maker');

var Tiles = requirejs('tiles');

app.use(express.static(__dirname + '/frontend/'));
app.use('/scripts/', express.static(__dirname + '/scripts/'));

// setup environments
var configuration = {
    'development': function() {
        app.use(express.logger('dev'));
    },
    'production': function() {
        io.set('log level', 1); // set log level to error and warn
    },
    'heroku': function() {
        this.production(); // apply production settings

        // disable websockets on heroku ceder stack
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    }
};

_.each(configuration, function(func, env, obj) {
    app.configure(env, _.bind(func, obj));
});

var world = Maker.create({
    width: 35,
    height: 40
});

io.sockets.on('connection', function (socket) {
    socket.emit('map', world.getMap().serialize());
    socket.emit('entities', _.map(world.getEntities(), function(entity) {
       return entity.serialize();
    }));
});

setInterval(function() {
   _.each(world.getEntities(), function(entity) {
      entity.fireEvent('tick');
   });

   var changeset = world.pickupChangeset();

   if (changeset.length > 0) {
      io.sockets.volatile.emit('update', changeset);
   }
}, 200);


// Start on heroku
var port = process.env.PORT || 3000;
console.log("Server start on port " + port);
server.listen(port);
