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
    Change = require('./server/client/change'),
    Tiles = require('./server/client/tiles'),
    PlayerContext = require('./server/playerContext'),
    Stats = require('./server/client/stats');

app.use(express.static(__dirname + '/frontend/'));
app.use('/scripts/', express.static(__dirname + '/scripts/'));
app.use('/components/', express.static(__dirname + '/components/'));

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

var initPlayer = function(socket, username) {
    var shapes = {
        0: Tiles.HUNTER,
        1: Tiles.WARRIOR,
        2: Tiles.MAGE
    };

    var player = world.addNewRandomEntity({
        shape: shapes[_.random(2)],
        stats: new Stats({
            hp: 20,
            maxHp: 20,
            name: username
        })
    });

    var playerContext = new PlayerContext({
        entity: player,
        connection: socket
    });
    players.push(playerContext);

    return playerContext;
};

io.sockets.on('connection', function (socket) {
    var playerContext = null,
        player = null;

    socket.on('login', function(data) {
        playerContext = initPlayer(socket, data.username);
        player = playerContext.getEntity();

        socket.emit('welcome', {
            map: world.getMap().serialize(),
            entities: [player.serialize()],
            playerId: player.getId()
        });
    });

    socket.on('movement', function(data) {
        var delta = data.delta;
        player.setXY(player.getX() + delta.x, player.getY() + delta.y);
        playerContext.setGeneration(data.generation);
    });

    socket.on('attack', function(data) {
        var attacker = world.getEntityById(data.attacker);
        playerContext.setGeneration(data.generation);
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

    _.each(players, function(player) {
        player.tick();
    });

    _.each(players, function(player) {
        var changeset = world.pickupChangeset(player);

        if (changeset.length > 0) {
            player.getConnection().volatile.emit('update', {
                generation: player.getGeneration(),
                changeset: _.map(changeset, Change.serialize)
            });
        }
    });

    world.clearChanges();
}, 200);


// Start on heroku
var port = process.env.PORT || 3000;
console.log("Server start on port " + port);
server.listen(port);
