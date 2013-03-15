define(['underscore', 'util', 'mousetrap', 'tiles',
   '/tilesets/oryx.js', 'world', 'ui', 'socket.io', 'domReady'
],
   function(_, Util, Mousetrap, Tiles, Tileset, World, Ui, Io)
{
   "use strict";

   var socket = Io.connect();

   var semaphore = new Util.Semaphore(0);

   var map = null;
   var entities = null;

   socket.on('map', function(payload) {
      map = World.Map.unserialize(payload);

      semaphore.raise();
   });

   socket.on('entities', function(payload) {
      var player = new World.Entity({
         x: 6,
         y: 6,
         shape: Tiles.HUNTER,
         id: 0
      });

      entities = [player];

      _.each(payload, function(record) {
         entities.push(World.Entity.unserialize(record));
      });

      semaphore.raise();
   });

   Tileset.ready.then(function() {
      semaphore.raise();
   });

   semaphore.when(3, function() {

      var world = new World.WorldVisible({
         map: map,
         player: entities[0],
         entities: entities,
         viewportWidth: 20,
         viewportHeight: 15
      });

      var canvas = document.getElementById('stage');

      var mapview = new Ui.MapView({
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
         document.getElementById('control-' + key).onclick = handler;
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
