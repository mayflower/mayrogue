// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'tiles',
    'tilesets/oryx', 'worldClient', 'entity', 'map',
    'change', 'statsView', 'control', 'network/client',
    'mapView', 'actionEmitter', 'actionExecutor',
    'domReady'
],
    function(_, Util, Tiles, Tileset, World, Entity, Map,
        Change, StatsView,  Control, Client, MapView, ActionEmitter, ActionExecutor)
{
    "use strict";

    var startDispatcher = function(username, useWebGL, forceTouch) {

        var touchAvailable = function() {
            return (forceTouch || ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        };

        var statsView = new StatsView({
            elt: document.getElementById('stats')
        });

        var MapViewClass = useWebGL ? MapView.WebGL : MapView.Vanilla,
            mapView = new MapViewClass(
        {
            tiles: Tileset,
            canvas: document.getElementById('stage')
        });

        var control = new Control.Meta();
        control.addControl(new Control.Keyboard());
        if (touchAvailable()) {
            control.addControl(new Control.Touch(
                {
                    controlElement: document.getElementById('player_control'),
                    canvasElement: document.getElementById('stage')
                }
            ));
        }

        var actionEmitter = new ActionEmitter({
            control: control
        });

        var actionExecutor = new ActionExecutor({
            source: actionEmitter
        });

        var client = new Client({
            actionSource: actionEmitter
        });

        var initWorld = function(map, entities, player) {
            var oldWorld = client.getWorld();
            if (oldWorld) {
                oldWorld.destroy();
            }

            var world = new World({
                map: map,
                player: player,
                entities: entities,
                viewportWidth: 20,
                viewportHeight: 15
            });

            mapView.setWorld(world);
            statsView.setPlayer(player);

            actionExecutor.setWorld(world);
            client.setWorld(world);
        };

        var onWelcome = function(payload) {
            var map = Map.unserialize(payload.map);

            var entities = _.map(payload.entities, function(record) {
                return Entity.unserialize(record);
            });

            var player = _.find(entities, function(entity) {
                return entity.getId() === payload.playerId;
            });

            Tileset.ready.then(function(success) {
                if (success) initWorld(map, entities, player);
            });
        };

        client.attachListeners({
            welcome: onWelcome,
            reconnect: function() {
                client.login(username);
            }
        }, window);

        client.login(username);
    };

    return startDispatcher;
});
