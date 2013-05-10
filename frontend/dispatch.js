// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'eventBus', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'mapView', 'change', 'socket.io', 'fastclick' /*@todo move it to the touch controller */, 'controls/controls', 'network/client','domReady'
],
    function(_, Util, EventBus, Tiles, Tileset, World, Entity, Map,
        MapView, Change, Io, FastClick, Control, Client)
{
    "use strict";

    var startDispater = function(username) {
        var socket = Io.connect();
        var client = null;
        //@todo this is now part of the client
        socket.emit('login', {'username': username});

        //@todo move this welcome function to client
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

        var initWorld = function(success, map, entities, player) {
            if (!success) return;

            var world = new World({
                map: map,
                player: player,
                entities: entities,
                viewportWidth: 20,
                viewportHeight: 15
            });

            client = new Client(socket, world, player);
            var canvas = document.getElementById('stage');

            //@todo maybe this can be delete/only call the constructor
            var mapview = new MapView({
                world: world,
                tiles: Tileset,
                canvas: canvas
            });

            //enable the controls
            var controls = new Control(client);
            controls.enable();
        };
        welcomePackage.and(Tileset.ready).then(initWorld);

        /*socket.on('update', function(payload) {
            var changeset = _.map(payload.changeset, Change.unserialize);
            var stale = (generation !== payload.generation);
            var world = mapview.getWorld();

            world.startBatchUpdate();
            _.each(changeset, function(change) {change.apply(world, stale);});
            world.endBatchUpdate();
        });*/

        //@todo refactor to reuse the welcome function
        socket.on('reconnecting', function() {
            if (mapview) {
                welcomePackage = new Util.Promise();
                welcomePackage.and(Tileset.ready).then(initWorld);

                mapview.destroy();
                mapview = null;
            }
        });

        //@todo this is now part of the client
        socket.on('reconnect', function () {
            socket.emit('login', {'username': username});
        });
    };

    EventBus.attachListeners({'login': startDispater});
});
