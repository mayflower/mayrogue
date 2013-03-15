define(['lib/underscore', 'lib/mousetrap', 'tiles',
   'tilesets/oryx', 'world', 'ui', 'socket.io', 'lib/domReady'
],
   function(_, Mousetrap, Tiles, Tileset, World, Ui)
{
   "use strict";

   var map = new World.RandomMap({
      width: 35,
      height: 50
   });

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

   var world = new World.World({
      map: map,
      player: hunter,
      entities: entities,
      viewportWidth: 20,
      viewportHeight: 15
   });

   Tileset.ready.then(function() {

      var canvas = document.getElementById('stage');

      var mapview = new Ui.MapView({
         world: world,
         tiles: Tileset,
         canvas: canvas
      });

      _.each({
         left: function() {
            hunter.setX(hunter.getX() - 1);
         },
         right: function() {
            hunter.setX(hunter.getX() + 1);
         },
         up: function() {
            hunter.setY(hunter.getY() - 1);
         },
         down: function() {
            hunter.setY(hunter.getY() + 1);
         }
      }, function(handler, key) {
         Mousetrap.bind(key, handler);
      });

      setInterval(function() {
         world.startBatchUpdate();

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
