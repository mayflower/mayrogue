define(['underscore', 'util'],
   function(_, Util)
{
   "use strict";

   var ui = {};

   ui.MapView = Util.extend(Util.Base, {
      properties: [
         {field: '_world', getter: true},
         {field: '_tiles', getter: true},
         {field: '_canvas', getter: true}
      ],

      _context: null,

      create: function(config) {
         var me = this;

         me.getConfig(config,
            ['world', 'tiles', 'canvas']);

         me._world.attachListeners({visibleChange: me.redraw}, me);

         me._canvas.width = me._tiles.width * me._world.getViewport().getWidth();
         me._canvas.height = me._tiles.height * me._world.getViewport().getHeight();
         me._context = me._canvas.getContext('2d');

         me.redraw();
      },

      destroy: function() {
         var me = this;

         me._world.detachListeners({visibleChange: me.redraw}, me);
         me.parent.destroy.call(me);
      },

      redraw: function() {
         var me = this;
         var x, y;
         var mapData = me._world.getMapData();
         var viewport = me._world.getViewport();
         var x0 = viewport.getX(), y0 = viewport.getY();

         for (x = x0; x < x0 + viewport.getWidth(); x++)
            for (y = y0; y < y0 + viewport.getHeight(); y++)

               me._tiles.drawTo(
                  me._context,
                  me._tiles.width * (x - x0),
                  me._tiles.height * (y - y0),
                  mapData[x][y]
               );

         _.each(me._world.getEntities(), function(entity) {

            me._tiles.drawTo(
               me._context,
               me._tiles.width * (entity.getX() - x0),
               me._tiles.height * (entity.getY() - y0),
               entity.getShape()
            );
         });
      }
   });

   return ui;
});
