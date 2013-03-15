define(['underscore', 'util', 'mousetrap', 'tiles',
   '/tilesets/oryx.js', 'world', 'ui', 'socket.io', 'domReady'
],
   function(_, Util, Mousetrap, Tiles, Tileset, World, Ui, Io)
{
   "use strict";

   var socket = Io.connect();

   var semaphore = new Util.Semaphore(0);

   var world = null;

   socket.on('map', function(blob) {
      var map = World.Map.unserialize(blob);

      var hunter = new World.Entity({
         x: 6,
         y: 6,
         shape: Tiles.HUNTER,
         id: 0
      });

      var entities = [hunter];

      _.times(20, function(index) {
         var shape;
         var x = Math.random();

         if (x < 0.3) {
            shape = Tiles.LICHKING;
         } else if (x < 0.6) {
            shape = Tiles.OGRE;
         } else {
            shape = Tiles.CTHULHU_GUY;
         }

         entities.push(new World.Entity({
            x: _.random(34),
            y: _.random(49),
            shape: shape,
            id: index + 1
         }));
      });

      world = new World.World({
         map: map,
         player: hunter,
         entities: entities,
         viewportWidth: 20,
         viewportHeight: 15
      });

      semaphore.raise();
   });

   Tileset.ready.then(function() {
      semaphore.raise();
   });

   semaphore.when(2, function() {

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
      });

      setInterval(function() {
         world.startBatchUpdate();

         var entities = world.getEntities();

         _.each(entities, function(entity, index) {
            if (index === 0 || Math.random() > 0.3) return;

            var dx = _.random(2) - 1;
            var dy = _.random(2) - 1;
            entity.setXY(entity.getX() + dx, entity.getY() + dy);
         });

         world.endBatchUpdate();

      }, 200);

      // pacify jshint
      return mapview;
   });
});
