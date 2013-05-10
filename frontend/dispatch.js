// vim:softtabstop=4:shiftwidth=4

/**
 * Client main.
 */

define(['underscore', 'util', 'tiles',
    '/tilesets/oryx.js', 'worldClient', 'entity', 'map',
    'mapView', 'socket.io', 'fastclick' /*@todo move it to the touch controller */, 'controls/controls', 'network/client','domReady'
],
    function(_, Util, Tiles, Tileset, World, Entity, Map,
        MapView, Io, FastClick, Control, Client)
{
    "use strict";

    var me = this;
    var socket = Io.connect();

    var welcomePackage = new Util.Promise();
    /**
     * @todo move this part to the network/client, it should be better located there
     */
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

        var client = new Client(socket, world, player);

        var canvas = document.getElementById('stage');


        //noinspection JSUnusedLocalSymbols
        var mapview = new MapView({
            world: world,
            tiles: Tileset,
            canvas: canvas
        });

        //enable the controls
        var controls = new Control(client);
        controls.enable();
    });
});
