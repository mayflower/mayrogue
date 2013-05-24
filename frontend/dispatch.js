// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'eventBus', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'mapViewGL', 'change', 'statsView', 'socket.io', 'fastclick' /*@todo move it to the touch controller */, 'controls/controls', 'network/client','domReady'
],
    function(_, Util, EventBus, Tiles, Tileset, World, Entity, Map,
        MapView, Change, StatsView, Io, FastClick, Control, Client)
{
    "use strict";

    var startDispatcher = function(username) {
        var socket = Io.connect();
        socket.emit('login', {'username': username});

        var welcomePackage = new Util.Promise();
        socket.on('welcome', function(payload) {
            var map = Map.unserialize(payload.map);

            var entities = _.map(payload.entities, function(record) {
                return Entity.unserialize(record);
            });

            var player = _.find(entities, function(entity) {
                return entity.getId() === payload.playerId;
            });

            welcomePackage.resolve(map, entities, player);
        });

        var mapview = null,
            statsView = null,
            client = null;
        var initWorld = function(success, map, entities, player) {

            if (!success) return;

            var world = new World({
                map: map,
                player: player,
                entities: entities,
                viewportWidth: 20,
                viewportHeight: 15
            });

            client = new Client({
                socket: socket,
                world: world,
                player:player
            });
            var canvas = document.getElementById('stage');

            mapview = new MapView({
                world: world,
                tiles: Tileset,
                canvas: canvas
            });

            statsView = new StatsView({
                player: player,
                elt: document.getElementById('stats')
            });

            //enable the controls
            //noinspection JSUnusedLocalSymbols
            var controls = new Control(client);
        };

        welcomePackage.and(Tileset.ready).then(function(success) {
            if (!success) return;

            initWorld.apply(this, arguments);

            socket.on('reconnecting', function() {
                if (mapview) {
                    welcomePackage = new Util.Promise();
                    welcomePackage.and(Tileset.ready).then(initWorld);

                    mapview.destroy();
                    mapview = null;
                }
            });

            socket.on('reconnect', function () {
                socket.emit('login', {'username': username});
            });
        });
    };

    EventBus.attachListeners({'login': startDispatcher});
});
