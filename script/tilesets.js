define(['lib/underscore', 'util', 'tiles'],
   function(_, Util, Tiles)
{

   var Tilesets = {};

   Tilesets.TileSheet = Util.extend(Util.Base, {
      _map: null,
      _url: null,
      _image: null,

      _tileWidth: 0,
      _tileHeight: 0,
      _origin: {x:0, y:0},

      width: null,
      height: null,

      ready: null,

      create: function(config) {
         var me = this;

         me.getConfig(config,
            ['url', 'tileWidth', 'tileHeight', 'map']);
         _.defaults(me, {
            width: me._tileWidth,
            height: me._tileHeight
         });

         me.ready = new Util.Promise();
         me._image = new Image();
         me._image.addEventListener('load', _.bind(me.ready.resolve, me.ready));

         me._image.src = me._url;
      },

      drawTo: function(context, x, y, ix, iy) {
         var me = this;
         
         context.drawImage(me._image,
            ix * me._tileWidth,
            iy * me._tileHeight,
            me._tileWidth,
            me._tileHeight,
            x,
            y,
            me.width,
            me.height
         );
      },

      setWidth: function(width) {
         this.width = width;
      },
      
      setHeight: function(height) {
         this.height = height;
      },

      drawTileTo: function(context, x, y, tile) {
         var me = this;

         if (me._map[tile]) {
            me.drawTo(context, x, y, me._map[tile].ix, me._map[tile].iy);
            return true;
         } else {
            return false;
         }
      }
   });

   Tilesets.TileSheetCollection = Util.extend(Util.Base, {
      _members: null,
      
      height: null,
      width: null,
      
      ready: null,
      _semaphore: null,

      create: function(config) {
         var me = this;

         me._members = [];
         me.getConfig(config, ['members']);

         if (config.width) {
            me.setWidth(config.width);
         } else if (me._members[0]) {
            me.setWidth(me._members[0].width);
         }

         if (config.height) {
            me.setHeight(config.height);
         } else if (me._members[0]) {
            me.setHeight(me._members[0].height);
         }

         me.ready = new Util.Promise();
         if (me._members.length > 0) {
            me._semaphore = new Util.Semaphore(0);

            me._semaphore.when(me._members.length,
               _.bind(me.ready.resolve, me.ready));

            _.each(me._members, function(tilesheet) {
               tilesheet.ready.then(_.bind(me._semaphore.raise, me._semaphore));
            });
         }
      },

      setWidth: function(width) {
         var me = this;

         me.width = width;
         _.each(me._members, function(tilesheet) {
            tilesheet.setWidth(width);
         });
      },

      setHeight: function(height) {
         var me = this;

         me.height = height;
         _.each(me._members, function(tilesheet) {
            tilesheet.setHeight(height);
         });
      },

      drawTileTo: function(context, x, y, tile) {
         return _.some(this._members, function(tilesheet) {
            return tilesheet.drawTileTo(context, x, y, tile);
         });
      }
   });

   return Tilesets;
});
