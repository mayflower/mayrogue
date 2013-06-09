// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'eventBus', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'change', 'statsView', 'controls/controls', 'network/client',
    'action', 'mapView', 'mapViewGL',
    'socket.io', 'domReady'
],
    function(_, Util, EventBus, Tiles, Tileset, World, Entity, Map,
        Change, StatsView,  Control, Client, Action, MapViewVanilla, MapViewGL,
        Io)
{
    "use strict";

    var startDispatcher = function(username, useWebGL) {
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
            client = null,
            controls = null;

        var initWorld = function(success, map, entities, player) {

            if (!success) return;

            var world = new World({
                map: map,
                player: player,
                entities: entities,
                viewportWidth: 20,
                viewportHeight: 15
            });


            if (client) {
                client.setWorld(world);
                client.setPlayer(player);
            } else {
                client = new Client({
                    socket: socket,
                    world: world,
                    player: player
                });
            }
            var canvas = document.getElementById('stage');

            /** TODO: This has to go into a factory. */
            var MapView = useWebGL ? MapViewGL : MapViewVanilla;
            mapview = new MapView({
                world: world,
                tiles: Tileset,
                canvas: canvas
            });

            if (statsView) {
                statsView.setPlayer(player);
            } else {
                statsView = new StatsView({
                    player: player,
                    elt: document.getElementById('stats')
                });
            }

            //enable the controls
            if (controls) {
                controls.setClient(client);
            } else {
                controls = new Control(client);
            }
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
