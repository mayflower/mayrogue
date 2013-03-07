define(['lib/underscore', 'util', 'geometry', 'tiles'],
   function(_, Util, Geometry, Tiles)
{
   var World = {};

   World.Entity = Util.extend(Util.Base, {
      properties: ['x', 'y', 'shape', 'world',
         {value: '_id', getter: true}
      ],
      mixins: [Util.Observable],

      _x: 0,
      _y: 0,
      _shape: 0,

      create: function(config) {
         var me = this;

         me.getConfig(config, ['map', 'x', 'y', 'shape', 'id']);
      },

      setX: function(x) {
         var me = this;
         var oldx = me._x;
         me._x = x;

         if (me._world && !me._world.fieldAccessible(x, me._y, me)) {
            me._x = oldx;
         } else {
            me.fireEvent('change', me, oldx, me._y);
         }

         return me;
      },

      setY: function(y) {
         var me = this;
         var oldy = me._y;
         me._y = y

         if (me._world && !me._world.fieldAccessible(me._x, y, me)) {
            me._y = oldy
         } else {
            me.fireEvent('change', me, me._x, oldy);
         }

         return me;
      },

      setXY: function(x, y) {
         var me = this;
         var oldx = me._x, oldy = me._y;
         me._x = x, me._y = y;

         if (me._world && !me._world.fieldAccessible(x, y, me)) {
            me._x = oldx;
            me._y = oldy;
         } else {
            me.fireEvent('change', me, oldx, oldy);
         }

         return me;
      }
   });

   World.Map = Util.extend(Util.Base, {
      properties: [
         {field: '_data', getter: true},
         {field: '_height', getter: true},
         {field: '_width', getter: true},
      ],

      create: function(config) {
         var me = this;

         me.getConfig(config, ['data', 'height', 'width']);
         if (!me._width) me._width = _.max(me._data);
         if (!me._height) me._height = _.max(me._data[0])
      },

      fieldAccessible: function(x, y) {
         var me = this;

         return (x >= 0) && (x < me._width) && (y >= 0) && (y < me._height)
            && Tiles.groundProperties[me._data[x][y]].walkable;
      }
   });

   World.RandomMap = Util.extend(World.Map, {
      _weights: {
         forest: 0.2,
         stone: 0.2,
         dirt: 0.5,
         grass: 1
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
      },

      _normalizeWeights: function() {
         var me = this;

         var norm = _.reduce(me._weights, function(x, y) {return  x + y}, 0);
         _.each(me._weights, function(weight, tile) {
            me._weights[tile] /= norm;
         });

      },

      _randomTile: function() {
         var me = this;
         var w = Math.random();
         
         for (i = Tiles.MIN_GROUND; i <= Tiles.MAX_GROUND; i++)
            if (w < me._weights[i]) {
               return i
            } else {
               w -= me._weights[i]
            }

         return null;
      }
   });

   World.World = Util.extend(Util.Base, {
      properties: [
         {field: '_map', getter: true},
         {field: '_player', getter: true},
         {field: '_entities', getter: true},
         {field: '_viewport', getter: true},
      ],
      mixins: [Util.Observable],

      _viewportWidth: null,
      _viewportHeight: null,
      _playerPosition: null,

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

      _onEntityChange: function(entity, oldx, oldy) {
         var me = this;

         if (entity === me._player) {
            me._trackPlayer();
         }
         if (me._viewport.isInside(oldx, oldy) ||
               me._viewport.isInside(entity.getX(), entity.getY()))
            me.fireEvent('visibleChange');

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

      fieldAccessible: function(x, y, entity) {
         var me = this;

         if (!me._map.fieldAccessible(x, y)) return false;

         if (!entity) return true;
         return !_.some(me._entities, function(e) {
            return (e !== entity && e.x == entity.x && e.y == entity.y);
         });
      }
   });

   return World;
});
