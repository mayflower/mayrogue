// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'mousetrap', 'tiles',
    '/tilesets/oryx.js', 'world', 'entity', 'map',
    'mapView', 'change', 'socket.io', 'fastclick', 'domReady'
],
    function(_, Util, Mousetrap, Tiles, Tileset, World, Entity, Map,
        MapView, Change, Io, FastClick)
{
    "use strict";

    var socket = Io.connect();

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

    welcomePackage.and(Tileset.ready).then(function(success, map, entities, player) {

        if (!success) return;

        var world = new World({
            map: map,
            player: player,
            entities: entities,
            viewportWidth: 20,
            viewportHeight: 15
        });

        var canvas = document.getElementById('stage');

        var mapview = new MapView({
            world: world,
            tiles: Tileset,
            canvas: canvas
        });

        var player = world.getPlayer();

        _.each({
            left: function() {
                player.setX(player.getX() - 1)
                socket.emit('movement', {x: -1, y: 0});
            },
            right: function() {
                player.setX(player.getX() + 1);
                socket.emit('movement', {x: 1, y: 0});
            },
            up: function() {
                player.setY(player.getY() - 1);
                socket.emit('movement', {x: 0, y: -1});
            },
            down: function() {
                player.setY(player.getY() + 1);
                socket.emit('movement', {x: 0, y: 1});
            }
        }, function(handler, key) {
            Mousetrap.bind(key, handler);

            var el = document.getElementById('control-' + key);
            if (el) {
                el.onclick = handler;
                new FastClick(el);
            }
        });

        socket.on('update', function(payload) {
            var changeset = _.map(payload, Change.unserialize);

            world.startBatchUpdate();
            _.each(changeset, function(change) {change.apply(world)});
            world.endBatchUpdate();
        });

        // pacify jshint
        return mapview;
    });
});
