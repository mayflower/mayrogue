// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'mapView/base'],
    function(_, Util, Base)
{
    "use strict";

    var _parent = Base.prototype;

    var Vanilla = Util.extend(Base, {
        properties: [
            {field: '_tiles', getter: true},
            {field: '_canvas', getter: true}
        ],

        _context: null,

        create: function(config) {
            var me = this;

            me.getConfig(config,
                ['tiles', 'canvas']);

            me._context = me._canvas.getContext('2d');
            me._context.fillStyle = config.textColor || '#FFFFFF';

            // The parent constructor might trigger a redraw, so we have to call it after setup
            _parent.create.apply(me, arguments);
        },

        setWorld: function(world) {
            var me = this;
            _parent.setWorld.apply(me, arguments);

            if (world) {
                me._canvas.width = me._tiles.width * me._world.getViewport().getWidth();
                me._canvas.height = me._tiles.height * me._world.getViewport().getHeight();
            }
        },

        redraw: function() {
            var me = this;
            var x, y;
            var mapData = me._world.getMapData();
            var viewport = me._world.getViewport();
            var x0 = viewport.getX(), y0 = viewport.getY();

            for (x = x0; x < x0 + viewport.getWidth(); x++)
                for (y = y0; y < y0 + viewport.getHeight(); y++)

                    me._tiles.drawWorldTo(
                        me._context,
                        me._tiles.width * (x - x0),
                        me._tiles.height * (y - y0),
                        mapData[x][y]
                    );

            _.each(me._world.getEntities(), function(entity) {

                me._tiles.drawEntityTo(
                    me._context,
                    me._tiles.width * (entity.getX() - x0),
                    me._tiles.height * (entity.getY() - y0),
                    entity
                );
            });
        }
    });

    return Vanilla;
});
