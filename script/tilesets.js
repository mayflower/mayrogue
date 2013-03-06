define(['lib/underscore', 'util', 'tiles'],
   function(_, Util, Tiles)
{

   var Tilesets = {};

   Tilesets.TileSet = Util.extend(Util.Base, {
      properties: [
         {field: 'height', setter: true},
         {field: 'width', setter: true},
         {field: '_tileWidth', getter: true},
         {field: '_tileHeight', getter: true}
      ],

      ready: null
   });

   Tilesets.TileSheet = Util.extend(Tilesets.TileSet, {
      _mapping: null,
      _url: null,
      _image: null,

      _origin: {x:0, y:0},

      create: function(config) {
         var me = this;

         me.getConfig(config,
            ['url', 'tileWidth', 'tileHeight', 'mapping']);
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

      drawTileTo: function(context, x, y, tile) {
         var me = this;

         if (me._mapping[tile]) {
            me.drawTo(context, x, y, me._mapping[tile].ix, me._mapping[tile].iy);
            return true;
         } else {
            return false;
         }
      }
   });

   Tilesets.TileSheetCollection = Util.extend(Tilesets.TileSet, {
      _members: null,
      
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

         return me;
      },

      setHeight: function(height) {
         var me = this;

         me.height = height;
         _.each(me._members, function(tilesheet) {
            tilesheet.setHeight(height);
         });

         return me;
      },

      drawTileTo: function(context, x, y, tile) {
         return _.some(this._members, function(tilesheet) {
            return tilesheet.drawTileTo(context, x, y, tile);
         });
      },

      getTileWidth: function() {
         var me = this;

         if (me._members.length > 0) return me._members[0].getTileWidth();
         return null;
      },

      getTileHeight: function() {
         var me = this;

         if (me._members.length > 0) return me._members[0].getTileHeight;
         return null;
      }
   });

   return Tilesets;
});
