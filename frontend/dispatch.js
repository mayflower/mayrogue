// vim: set softtabstop=4

define(['underscore', 'util', 'mousetrap', 'tiles',
    '/tilesets/oryx.js', 'world', 'entity', 'map',
    'mapView', 'socket.io', 'fastclick', 'domReady'
],
    function(_, Util, Mousetrap, Tiles, Tileset, World, Entity, Map,
        MapView, Io, FastClick)
{
    "use strict";

    var socket = Io.connect();

    var map = new Util.Promise();
    socket.on('map', function(payload) {
        map.resolve(Map.unserialize(payload));
    });

    var entities = new Util.Promise();
    socket.on('entities', function(payload) {
        var player = new Entity({
            x: 6,
            y: 6,
            shape: Tiles.HUNTER,
            id: 0
        });

        var _entities = [player];

        _.each(payload, function(record) {
            _entities.push(Entity.unserialize(record));
        });

        entities.resolve(_entities);
    });

    map.and(entities).and(Tileset.ready).then(function(success, map, entities) {

        if (!success) return;

        var world = new World({
            map: map,
            player: entities[0],
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
                player.setX(player.getX() - 1);
            },
            right: function() {
                player.setX(player.getX() + 1);
            },
            up: function() {
                player.setY(player.getY() - 1);
            },
            down: function() {
                player.setY(player.getY() + 1);
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
            _.each(payload, function(changeset) {
                world.startBatchUpdate();

                var entity = world.getEntityById(changeset.id);

                if (entity) {
                    entity.setXY(changeset.x, changeset.y);
                }

                world.endBatchUpdate();
            });
        });

        // pacify jshint
        return mapview;
    });
});
