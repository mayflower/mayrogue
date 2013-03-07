define(['lib/underscore', 'lib/mousetrap', 'tiles',
   'tilesets/oryx', 'world', 'ui', 'lib/domReady'
],
   function(_, Mousetrap, Tiles, Tileset, World, Ui)
{
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

   var world = new World.World({
      map: map,
      player: hunter,
      entities: [hunter],
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
   });
});
