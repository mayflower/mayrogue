define(['lib/underscore', 'lib/mousetrap', 'util'],
   function(_, Mousetrap, Util)
{
   return (function () {
      var Tileset = {
         forest: 0,
         grass: 1,
         dirt: 2,
         hunter: 3,
         
         compile: function(collection) {
            var me = this;

            var compiled = {}; 
            _.each(collection, function(value, key) {
               if (key in me) compiled[me[key]] = value;
            })

            return compiled;
         }
      };

      var Actor = Util.extend(Util.Base, {
         x: 0,
         y: 0,
         shape: 0,

         _map: null,

         create: function(config) {
            var me = this;

            me.getConfig(config, ['map']);
            _.extend(me, _.pick(config, 'x', 'y', 'shape'));
         },

         setX: function(x) {
            var me = this;
            me.x = Util.boundValue(x, 0, me._map.getWidth() - 1);
         },

         setY: function(y) {
            var me = this;
            me.y = Util.boundValue(y, 0, me._map.getHeight() - 1);
         }
      });

      var Map = Util.extend(Util.Base, {
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

      var RandomMap = Util.extend(Map, {
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

      var TileSheet = Util.extend(Util.Base, {
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

      var TileSheetCollection = Util.extend(Util.Base, {
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

      var MapView = Util.extend(Util.Base, {
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

            var x = Util.boundValue(me._player.x - me._playerPosition.x, 
               0, me._map.getWidth() - me._extend.width);
            var y = Util.boundValue(me._player.y - me._playerPosition.y,
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
                  me._tiles.width * (actor.x - me._origin.x),
                  me._tiles.height * (actor.y - me._origin.y),
                  actor.shape
               );
            });
         }
      });

      var tilesheetTerrain = new TileSheet({
         url: './res/terrain.gif',
         tileWidth: 32,
         tileHeight: 32,
         map: Tileset.compile({
            forest: {ix: 9, iy: 4},
            grass: {ix: 6, iy: 4},
            dirt: {ix: 11, iy: 1}
         })
      });

      var tilesheetActors = new TileSheet({
         url: './res/actors.gif',
         tileWidth: 32,
         tileHeight: 32,
         map: Tileset.compile({
            hunter: {ix: 0, iy: 0}
         })
      });

      var tilesheet = new TileSheetCollection({
         members: [tilesheetTerrain, tilesheetActors]
      });

      var map = new RandomMap({
         width: 35,
         height: 50
      });

      var hunter = new Actor({
         x: 6,
         y: 6,
         shape: Tileset['hunter'],
         map: map
      });

      var mapview = new MapView({
         map: map,
         tiles: tilesheet,
         extend: {width: 20, height: 15},
         actors: [hunter],
         player: hunter
      });

      var canvas = document.getElementById('stage');
      var context = canvas.getContext('2d');

      canvas.width = tilesheet.width * mapview.getExtend().width;
      canvas.height = tilesheet.height * mapview.getExtend().height;

      function redraw() {
         context.clearRect(0, 0, canvas.width, canvas.height);
         mapview.drawTo(context);
      }


      tilesheet.ready.then(function() {
         mapview.drawTo(context);

         _.each({
            left: function() {
               hunter.setX(hunter.x - 1);
               redraw();
            },
            right: function() {
               hunter.setX(hunter.x + 1);
               redraw();
            },
            up: function() {
               hunter.setY(hunter.y - 1);
               redraw();
            },
            down: function() {
               hunter.setY(hunter.y + 1);
               redraw();
            }
         }, function(handler, key) {
            Mousetrap.bind(key, handler);
         });
      });

   });
});
