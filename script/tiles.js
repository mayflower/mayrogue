define(['lib/underscore', 'util'],
   function(_, Util)
{
   var Tiles = {
      FOREST: 0,
      GRASS: 1,
      DIRT: 2,
      STONE: 3,

      HUNTER: 400,
      LICHKING: 401,
      OGRE: 402,

      MIN_GROUND: 0,
      MAX_GROUND: 3,
      
      compile: function(collection) {
         var me = this;

         var compiled = {}; 
         _.each(collection, function(value, key) {
            key = key.toUpperCase();
            if (key in me) compiled[me[key]] = value;
         })

         return compiled;
      }
   };

   Tiles.groundProperties = Tiles.compile({
      stone: {
         walkable: false
      }
   });

   for (var tile = Tiles.MIN_GROUND; tile <= Tiles.MAX_GROUND; tile++) {

      if (!Tiles.groundProperties[tile]) Tiles.groundProperties[tile] = {};
      _.defaults(Tiles.groundProperties[tile], {
         walkable: true
      });
   }

   return Tiles;
});
