// vim:softtabstop=4:shiftwidth=4

"use strict";

var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'scripts'
});

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    RandomWorld = require('./server/randomWorld'),
    Change = require('./server/change'),
    Tiles = require('./server/tiles'),
    PlayerContext = require('./server/playerContext');

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

var world = new RandomWorld({
    width: 35,
    height: 40
});

var players = [];

io.sockets.on('connection', function (socket) {
    var shapes = {
        0: Tiles.HUNTER,
        1: Tiles.WARRIOR,
        2: Tiles.MAGE
    };

    var player = world.addNewRandomEntity({
        shape: shapes[_.random(2)]
    });

    var playerContext = new PlayerContext({
        entity: player,
        connection: socket
    });
    players.push(playerContext);

    socket.emit('welcome', {
        map: world.getMap().serialize(),
        entities: _.map(world.getEntities(), function(entity) {
           return entity.serialize();
        }),
        playerId: player.getId()
    });

    socket.on('movement', function(data) {
        var delta = data.delta;
        player.setXY(player.getX() + delta.x, player.getY() + delta.y);
        playerContext.setGeneration(data.generation);
    });

    socket.on('attack', function(data) {
        var attacker = world.getEntityById(data.attacker);
        attacker.attack();
    });

    socket.on('disconnect', function() {
        world.removeEntity(player);
        players = _.without(players, playerContext);
    });
});

setInterval(function() {
    _.each(world.getEntities(), function(entity) {
        entity.fireEvent('tick');
    });

    var changeset = _.map(world.pickupChangeset(), Change.serialize);

    if (changeset.length > 0) {
        _.each(players, function(player) {
            player.getConnection().volatile.emit('update', {
                generation: player.getGeneration(),
                changeset: changeset
            });
        });
    }
}, 200);


// Start on heroku
var port = process.env.PORT || 3000;
console.log("Server start on port " + port);
server.listen(port);
