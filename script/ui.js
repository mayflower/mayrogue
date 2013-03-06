define(['lib/underscore', 'util'],
   function(_, Util)
{
   var ui = {};

   ui.MapView = Util.extend(Util.Base, {
      _map: null,
      _origin: null,
      _extend: null,
      _tiles: null,
      _actors: null,
      _player: null,
      _playerPosition: null,

      _trackPlayer: true,

      create: function(config) {
         var me = this;

         me.getConfig(config,
            ['map', 'origin', 'tiles', 'actors', 'player',
               'trackPlayer', 'playerPosition', 'extend']);

         if (config.origin) {
            me._origin = config.origin;
         } else {
            me._origin = {x:0, y:0};
         }

         _.defaults(me, {
            _actors: [],
            _playerPosition: {
               x: Math.floor(me._extend.width / 2),
               y: Math.floor(me._extend.height / 2)
            }
         });
      },

      setOrigin: function(x, y) {
         this._origin.x = x;
         this._origin.y = y;
      },

      setExtend: function(width, height) {
         this._extend.width = width;
         this._extend.height = height;
      },

      getExtend: function() {
         return _.clone(this._extend);
      },

      _calculateOrigin: function() {
         var me = this;
         if (!me._player) return;

         var x = Util.boundValue(me._player.getX() - me._playerPosition.x, 
            0, me._map.getWidth() - me._extend.width);
         var y = Util.boundValue(me._player.getY() - me._playerPosition.y,
            0, me._map.getHeight() - me._extend.height);

         me.setOrigin(x, y);
      },

      drawTo: function(context) {
         var me = this;
         var x, y;
         var mapData = me._map.getData();

         if (me._trackPlayer) me._calculateOrigin();

         for (x = me._origin.x; x < me._origin.x + me._extend.width; x++)
            for (y = me._origin.y; y < me._origin.y + me._extend.height; y++)
               me._tiles.drawTileTo(
                  context,
                  me._tiles.width * (x - me._origin.x),
                  me._tiles.height * (y - me._origin.y),
                  mapData[x][y]
               );

         _.each(me._actors, function(actor) {
            me._tiles.drawTileTo(
               context,
               me._tiles.width * (actor.getX() - me._origin.x),
               me._tiles.height * (actor.getY() - me._origin.y),
               actor.getShape()
            );
         });
      }
   });

   return ui;
});
