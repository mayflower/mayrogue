define(['lib/underscore', 'util'],
   function(_, Util)
{
   var Tiles = {
      forest: 0,
      grass: 1,
      dirt: 2,
      hunter: 3,

      MIN: 0,
      MAX: 3,
      
      compile: function(collection) {
         var me = this;

         var compiled = {}; 
         _.each(collection, function(value, key) {
            if (key in me) compiled[me[key]] = value;
         })

         return compiled;
      }
   };

   return Tiles;
});
