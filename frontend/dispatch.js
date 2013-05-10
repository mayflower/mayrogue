// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'mousetrap', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'mapView', 'change', 'socket.io', 'fastclick', 'domReady', 'controls/controls'
],
    function(_, Util, Mousetrap, Tiles, Tileset, World, Entity, Map,
        MapView, Change, Io, FastClick, control)
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


        //noinspection JSUnusedLocalSymbols
        var mapview = new MapView({
            world: world,
            tiles: Tileset,
            canvas: canvas
        });

        var generation = 0;

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

        //enable the controls
        debugger;
        control.apply();

        /*window.addEventListener("playerMoveLeft", function() {
            player.setX(player.getX() - 1);
            broadcastMovement(-1, 0);
        });*/
        /*
        _.each({
                   playerMoveLeft: function() {
                       player.setX(player.getX() - 1);
                       broadcastMovement(-1, 0);

                   },
                   playerMoveRight: function() {
                       player.setX(player.getX() + 1);
                       broadcastMovement(1, 0);
                   },
                   playerMoveUp: function() {
                       player.setY(player.getY() - 1);
                       broadcastMovement(0, -1);
                   },
                   playerMoveDown: function() {
                       player.setY(player.getY() + 1);
                       broadcastMovement(0, 1);
                   },
                   playerAttack: function() {
                       // attack local
                       player.attack(1,1);
                       // send attack to server
                       broadcastAttack(1,1);
                   }
               }, function(handler, event) {
                    window.addEventListener(event, handler);
            });*/

        socket.on('update', function(payload) {
            var changeset = _.map(payload.changeset, Change.unserialize);
            var stale = (generation !== payload.generation);

            world.startBatchUpdate();
            _.each(changeset, function(change) {change.apply(world, stale);});
            world.endBatchUpdate();
        });
    });
});
