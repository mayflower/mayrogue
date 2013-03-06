define(['lib/underscore', 'util', 'geometry'],
   function(_, Util, Geometry)
{
   var World = {};

   World.Entity = Util.extend(Util.Base, {
      properties: ['x', 'y', 'shape',
         {value: '_id', getter: true}
      ],
      mixins: [Util.Observable],

      _x: 0,
      _y: 0,
      _shape: 0,

      _map: null,

      create: function(config) {
         var me = this;

         me.getConfig(config, ['map', 'x', 'y', 'shape', 'id']);
      },

      setX: function(x) {
         var me = this;
         var oldx = me._x;

         me._x = Util.boundValue(x, 0, me._map.getWidth() - 1);
         me.fireEvent('change', me, oldx, me._y);

         return me;
      },

      setY: function(y) {
         var me = this;
         var oldy = me._y;

         me._y = Util.boundValue(y, 0, me._map.getHeight() - 1);
         me.fireEvent('change', me, me._x, oldy);

         return me;
      },

      setXY: function(x, y) {
         var me = this;
         var oldx = me._x, oldy = me._y;

         me._x = Util.boundValue(x, 0, me._map.getWidth() - 1);
         me._y = Util.boundValue(y, 0, me._map.getHeight() - 1);

         me.fireEvent('change', me, oldx, oldy);

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
            ['map', 'player', 'entities', 'viewportWidth', 'viewportHeight']);
         _.defaults(me, {_entities: []});

         me._viewport = new Geometry.Rectangle({
            x: 0,
            y: 0,
            width: me._viewportWidth,
            height: me._viewportHeight
         });

         _.each(me._entities, function(entity) {
            entity.attachListeners({change: me._onEntityChange}, me);
         });

         me._playerPosition = {
            x: Math.floor(me._viewport.getWidth() / 2),
            y: Math.floor(me._viewport.getHeight() / 2)
         };
      },

      addEntity: function(entity) {
         var me = this;

         me._entities.push(entity);
         entity.attachListeners({change: me._onEntitiyChange}, me);
      },

      removeEntity: function(entity) {
         var me = this;

         me._entities = _.without(me._entities, entity);
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

         me.parent.destroy.call(me);
      });

      }
   });

   return World;
});
