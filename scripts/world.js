define(['underscore', 'util', 'geometry', 'tiles'],
   function(_, Util, Geometry, Tiles)
{
   "use strict";

   var World = {};

   World.Entity = Util.extend(Util.Base, {
      properties: ['shape', 'world',
         {field: '_id', getter: true},
         {field: '_boundingBox', getter: true}
      ],
      mixins: [Util.Observable],

      _shape: 0,

      create: function(config) {
         var me = this;

         me.getConfig(config, ['map', 'shape', 'id']);

         me._boundingBox = new Geometry.Rectangle({
            x: config.x,
            y: config.y,
            width: Tiles.properties[me._shape].width,
            height: Tiles.properties[me._shape].height
         });
      },

      _changePosition: function(x, y) {
         var me = this;

         var boundingBoxNew = new Geometry.Rectangle({
            x: x,
            y: y,
            height: me._boundingBox.getHeight(),
            width: me._boundingBox.getWidth()
         });
         var boundingBoxOld = me._boundingBox;

         if (!me._world ||
               me._world.rectAccessible(boundingBoxNew, me))
         {
            me._boundingBox = boundingBoxNew;
            me.fireEvent('change', me, boundingBoxOld, boundingBoxNew);
         }
      },

      getX: function() {
         var me = this;

         return me._boundingBox.getX();
      },

      getY: function() {
         var me = this;

         return me._boundingBox.getY();
      },

      setX: function(x) {
         var me = this;
         
         me._changePosition(x, me._boundingBox.getY());

         return me;
      },

      setY: function(y) {
         var me = this;

         me._changePosition(me._boundingBox.getX(), y);

         return me;
      },

      setXY: function(x, y) {
         var me = this;

         me._changePosition(x, y);

         return me;
      },

      serialize: function() {
         var me = this;

         return {
            x: me.getX(),
            y: me.getY(),
            width: me._boundingBox.getWidth(),
            height: me._boundingBox.getHeight(),
            shape: me._shape,
            id: me._id
         }
      }
   });

   World.Entity.unserialize = function(blob) {
      return new World.Entity(blob);
   };

   World.Map = Util.extend(Util.Base, {
      properties: [
         {field: '_data', getter: true},
         {field: '_height', getter: true},
         {field: '_width', getter: true}
      ],

      create: function(config) {
         var me = this;

         me.getConfig(config, ['data', 'height', 'width']);
         if (!me._width) me._width = _.max(me._data);
         if (!me._height) me._height = _.max(me._data[0]);
      },

      fieldAccessible: function(x, y) {
         var me = this;

         return (x >= 0) && (x < me._width) && (y >= 0) && (y < me._height) &&
            Tiles.properties[me._data[x][y]].walkable;
      },

      rectAccessible: function(rect) {
         var me = this;

         var x0 = rect.getX(), y0 = rect.getY(),
            width = rect.getWidth(), height = rect.getHeight();

         if (x0 < 0 || y0 < 0 || x0 > me._width - width ||
               y0 > me._height - height) return false;
         
         for (var x = x0; x < x0 + width; x++)
            for (var y = y0; y < y0 + height; y++)
               if (!Tiles.properties[me._data[x][y]].walkable) return false;

         return true;
      },

      serialize: function() {
         var me = this;

         return {
            width: me._width,
            height: me._height,
            data: me._data
         };
      }
   });

   World.Map.unserialize = function(blob) {
      return new World.Map({
         width: blob.width,
         height: blob.height,
         data: blob.data
      });
   };

   World.RandomMap = Util.extend(World.Map, {
      _weights: {
         forest: 0.1,
         forest1: 0.1,
         forest2: 0.1,
         forest3: 0.1,
         flower_white: 0.1,
         flower_red: 0.1,
         stone: 0.5,
         dirt: 0.7,
         grass: 1.9
      },

      create: function(config) {
         var me = this;

         me.getConfig(config, ['height', 'width']);

         if (config.weights)
            me._weights = _.defaults(config.weights, me._weights);
         me._weights = Tiles.compile(me._weights);
         me._normalizeWeights();

         var x, y;
         me._data = [];
         for (x = 0; x < me._width; x++) {
            me._data[x] = [];
            for (y = 0;  y < me._height; y++) {
               me._data[x][y] = me._randomTile();
            }
         }

         for (var i = 0; i < 2; i++) {
            me._smooth();
         }
      },

       /**
        * smooth the generated world
        *
        * @see http://roguebasin.roguelikedevelopment.org/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels
        *
        * @private
        */
      _smooth: function() {
           var me = this,
               x,
               y;

           for (x = 0; x < me._width; x++) {
               for (y = 0; y < me._height; y++) {
                   if (me._isBorder(x, y) || me._countStoneTilesWithinOneStep(x, y) >= 5) {
                       // change to stone
                       me._data[x][y] = Tiles.STONE;
                   }
               }
           }
      },

       /**
        * check if x,y is a border tile
        *
        * @param x
        * @param y
        * @returns {boolean}
        * @private
        */
       _isBorder: function(x, y) {
           var me = this;

           if (x == 0 || y == 0 || x >= me._width - 1 || y >= me._height - 1) {
               return true;
           } else {
               return false;
           }
       },

       /**
        * count how many tiles around (x,y) are stone tiles (within one step)
        *
        * @param x
        * @param y
        * @returns {number}
        * @private
        */
      _countStoneTilesWithinOneStep: function(x, y) {
          var offsets = [-1, 0, 1],
              i,
              j,
              stoneTileCount = 0,
              me = this;

          var pos_x, pos_y;

          for (i = 0; i < offsets.length; i++) {
              for (j = 0; j < offsets.length; j++) {

                  pos_x = x + offsets[i];
                  pos_y = y + offsets[j];

                  if (me._data[pos_x] && Tiles.STONE == me._data[pos_x][pos_y]) {
                      stoneTileCount++;
                  }
              }
          }

          return stoneTileCount;
      },

      _normalizeWeights: function() {
         var me = this;

         var norm = _.reduce(me._weights, function(x, y) {return  x + y;}, 0);
         _.each(me._weights, function(weight, tile) {
            me._weights[tile] /= norm;
         });
      },

      _randomTile: function() {
         var me = this;
         var w = Math.random();
         
         for (var i = Tiles.MIN_GROUND; i <= Tiles.MAX_GROUND; i++)
            if (w < me._weights[i]) {
               return i;
            } else {
               w -= me._weights[i];
            }

         return null;
      }
   });

   World.World = Util.extend(Util.Base, {
      properties: ['dirty',
         {field: '_map', getter: true},
         {field: '_player', getter: true},
         {field: '_entities', getter: true},
         {field: '_viewport', getter: true},
         {field: '_batchInProgress', getter: 'batchInProgress'}
      ],
      mixins: [Util.Observable],

      _viewportWidth: null,
      _viewportHeight: null,
      _playerPosition: null,

      _dirty: false,
      _batchInProgress: false,

      create: function(config) {
         var me = this;

         me.getConfig(config,
            ['map', 'player', 'viewportWidth', 'viewportHeight']);

         me._viewport = new Geometry.Rectangle({
            x: 0,
            y: 0,
            width: me._viewportWidth,
            height: me._viewportHeight
         });

         me._entities = [];
         if (config.entities) _.each(config.entities, function(entity) {
            me.addEntity(entity);
         });

         me._playerPosition = {
            x: Math.floor(me._viewport.getWidth() / 2),
            y: Math.floor(me._viewport.getHeight() / 2)
         };
      },

      addEntity: function(entity) {
         var me = this;

         me._entities.push(entity);
         entity.setWorld(me);
         entity.attachListeners({change: me._onEntityChange}, me);
      },

      removeEntity: function(entity) {
         var me = this;

         me._entities = _.without(me._entities, entity);
         entity.setWorld(null);
         entity.detachListeners({change: me._onEntityChange}, me);
      },

      _onEntityChange: function(entity, bbOld, bbNew) {
         var me = this;

         if (entity === me._player) {
            me._trackPlayer();
         }

         if (me._viewport.intersect(bbOld) || me._viewport.intersect(bbNew)) {

            if (me._batchInProgress) {
               me._dirty = true;
            } else {
               me.fireEvent('visibleChange');
            }
         }

         me.fireEvent('change');
      },

      _trackPlayer: function() {
         var me = this;

         var x = Util.boundValue(me._player.getX() - me._playerPosition.x, 
            0, me._map.getWidth() - me._viewport.getWidth());
         var y = Util.boundValue(me._player.getY() - me._playerPosition.y,
            0, me._map.getHeight() - me._viewport.getHeight());

         me._viewport.setX(x);
         me._viewport.setY(y);
      },

      getEntityById: function(id) {
         var me = this;
         var found = _.find(me._entities, function(entity) {
            return id === entity.getId();
         });

         if (!found) return null;
         return found;
      },

      getMapData: function() {
         var me = this;

         return me._map.getData();
      },

      destroy: function() {
         var me = this;

         _.each(me._entities, function(entity) {
            entity.detachListeners({change: me._onEntityChange}, me);
         });

         me.parent.destroy.call(me);
      },

      rectAccessible: function(rect, entity) {
         var me = this;

         if (!me._map.rectAccessible(rect)) return false;

         if (!entity) return true;
         return !_.some(me._entities, function(e) {
            return (e !== entity &&
               e.getBoundingBox().intersect(rect));
         });
      },

      fieldAccessible: function(x, y, entity) {
         var me = this;

         if (!me._map.fieldAccessible(x, y)) return false;

         if (!entity) return true;
         return !_.some(me._entities, function(e) {
            return (e !== entity &&
               e.getBoundingBox().isInside(x, y));
         });
      },

      startBatchUpdate: function() {
         var me = this;

         me._batchInProgress = true;
         me._dirty = false;
      },

      endBatchUpdate: function() {
         var me = this;

         me._batchInProgress = false;
         if (me._dirty) me.fireEvent('visibleChange');
         me._dirty = false;
      }
   });

   return World;
});
