define(['lib/underscore', 'util', 'tiles'],
   function(_, Util, Tiles)
{
   var World = {};

   World.Entity = Util.extend(Util.Base, {
      properties: ['x', 'y', 'shape'],

      _x: 0,
      _y: 0,
      _shape: 0,

      _map: null,

      create: function(config) {
         var me = this;

         me.getConfig(config, ['map', 'x', 'y', 'shape']);
      },

      setX: function(x) {
         var me = this;
         me._x = Util.boundValue(x, 0, me._map.getWidth() - 1);
      },

      setY: function(y) {
         var me = this;
         me._y = Util.boundValue(y, 0, me._map.getHeight() - 1);
      }
   });

   World.Map = Util.extend(Util.Base, {
      _data: null,
      _height: null,
      _width: null,

      create: function(config) {
         var me = this;

         me.getConfig(config, ['data', 'height', 'width']);
         if (!me._width) me._width = _.max(me._data);
         if (!me._height) me._height = _.max(me._data[0])
      },

      getData: function() {
         return this._data;
      },

      getWidth: function() {
         return this._width;
      },

      getHeight: function() {
         return this._height;
      }
   });

   World.RandomMap = Util.extend(World.Map, {
      create: function(config) {
         var me = this;

         me.getConfig(config, ['height', 'width']);

         var x, y;
         me._data = [];
         for (x = 0; x < me._width; x++) {
            me._data[x] = [];
            for (y = 0;  y < me._height; y++) {
               me._data[x][y] = _.random(2);
            }
         }
      }
   });

   return World;
});
