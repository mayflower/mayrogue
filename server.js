// vim:softtabstop=4:shiftwidth=4

"use strict";

var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'shared'
});

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    RandomWorld = require('./server/randomWorld'),
    Change = require('./server/shared/change'),
    Tiles = require('./server/shared/tiles'),
    PlayerContext = require('./server/playerContext'),
    Stats = require('./server/shared/stats'),
    Entity = require('./server/shared/entity'),
    Action = require('./server/shared/action');

var useBuild = false;

// setup environments
var configuration = {
    'development': function() {
        app.use(express.logger('dev'));
    },
    'production': function() {
        io.set('log level', 1); // set log level to error and warn
        useBuild = true;
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

// Serve frontend/index.html on / and on /index.html
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/frontend/index.html');
});
app.get('/index.html', function(req, res) {
    res.sendfile(__dirname + '/frontend/index.html');
});

// If we use the build, override /frontend/application.js with the built module
if (useBuild) {
    app.get('/frontend/application.js', function(req, res) {
        res.sendfile(__dirname + '/frontend/application.build.js');
    });
}

// Statically serve all other required directories
app.use('/frontend/', express.static( __dirname + '/frontend/'));
app.use('/shared/', express.static(__dirname + '/shared/'));
app.use('/components/', express.static(__dirname + '/components/'));

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
        }),
        role: Entity.Role.PLAYER
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

    socket.on('action', function(data) {
        if (!playerContext) return;

        var action = Action.unserialize(data.action);
        if (action.validate()) {
            action.execute(player, world);
        }
        playerContext.setGeneration(data.generation);
    });

    socket.on('disconnect', function() {
        if (player) {
            world.removeEntity(player);
        }
        players = _.without(players, playerContext);
    });
});

setInterval(function() {
    _.each(world.getEntities(), function(entity) {
        entity.fireEvent('tick');
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
