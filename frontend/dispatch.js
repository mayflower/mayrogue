// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'eventBus', 'mousetrap', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'mapView', 'change', 'statsView', 'socket.io', 'fastclick', 'domReady'
],
    function(_, Util, EventBus, Mousetrap, Tiles, Tileset, World, Entity, Map,
        MapView, Change, StatsView, Io, FastClick)
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
            statsView = null;
        var generation = 0;
        var initWorld = function(success, map, entities, player) {

            if (!success) return;

            var world = new World({
                map: map,
                player: player,
                entities: entities,
                viewportWidth: 20,
                viewportHeight: 15
            });

            var canvas = document.getElementById('stage');

            mapview = new MapView({
                world: world,
                tiles: Tileset,
                canvas: canvas
            });

            statsView = new StatsView({
                player: player,
                elt: document.getElementById('name_stats')
            });

            generation = 0;

            function broadcastMovement(dx, dy) {
                socket.emit('movement', {
                    generation: ++generation,
                    delta: {x: dx, y: dy}
                });
            }

            function broadcastAttack() {
                socket.emit('attack', {
                    generation: ++generation,
                    attacker: player.getId()
                });
            }

            _.each({
                left: function() {
                    player.setX(player.getX() - 1);
                    broadcastMovement(-1, 0);
                },
                right: function() {
                    player.setX(player.getX() + 1);
                    broadcastMovement(1, 0);
                },
                up: function() {
                    player.setY(player.getY() - 1);
                    broadcastMovement(0, -1);
                },
                down: function() {
                    player.setY(player.getY() + 1);
                    broadcastMovement(0, 1);
                },
                a: function() {
                    // attack local
                    player.attack();
                    // send attack to server
                    broadcastAttack();
                }
            }, function(handler, key) {
                Mousetrap.bind(key, handler);

                var el = document.getElementById('control-' + key);
                if (el) {
                    el.onclick = handler;

                    //noinspection JSUnusedLocalSymbols
                    var fastClick = new FastClick(el);
                }
            });
        };

        welcomePackage.and(Tileset.ready).then(function(success) {
            if (!success) return;

            initWorld.apply(this, arguments);

            socket.on('update', function(payload) {
                var changeset = _.map(payload.changeset, Change.unserialize);
                var stale = (generation !== payload.generation);
                var world = mapview.getWorld();

                world.startBatchUpdate();
                _.each(changeset, function(change) {change.apply(world, stale);});
                world.endBatchUpdate();
            });

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
