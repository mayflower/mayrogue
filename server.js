var requirejs = require('requirejs');
requirejs.config({
   baseUrl: 'scripts'
});

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    World = require('./server/world');

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

var world = World.createRandom(35, 40);

var changeset = [];

_.each(world.getEntities(), function(entity) {
   entity.attachListeners({
      change: function() {
         changeset.push({
            id: entity.getId(),
            x: entity.getX(),
            y: entity.getY()
         });
      }
   }, null);
});

io.sockets.on('connection', function (socket) {
    socket.emit('map', world.getMap().serialize());
    socket.emit('entities', _.map(world.getEntities(), function(entity) {
       return entity.serialize();
    }));
});

setInterval(function() {
   changeset.splice(0, changeset.length);

   _.each(world.getEntities(), function(entity, index) {
      if (Math.random() > 0.3) return;

      var dx = _.random(2) - 1;
      var dy = _.random(2) - 1;
      entity.setXY(entity.getX() + dx, entity.getY() + dy);
   });

   if (changeset.length > 0) {
      io.sockets.volatile.emit('update', changeset);
   }
}, 200);


// Start on heroku
var port = process.env.PORT || 3000;
console.log("Server start on port " + port);
server.listen(port);
