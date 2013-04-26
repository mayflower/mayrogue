// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'tiles', 'tilesets/tileSheet'],
    function(_, Util, Tiles, TileSheet) {

    "use strict";

    var TileSheetLarge = Util.extend(TileSheet, {

        _drawTo: function(context, x, y, ix, iy, width, height) {
            var me = this;
            
            context.drawImage(me._image,
                ix * me._tileWidth,
                iy * me._tileHeight,
                me._tileWidth * width,
                me._tileHeight * height,
                x,
                y,
                me.width * width,
                me.height * height
            );
        },

        drawEntityTo: function(context, x, y, entity) {
            var me = this;

            var tile = entity.getShape();

            var tiledef = Tiles.properties[tile];
            var def = me._mapping[tile];

            if (!def) return false;

            for (var i = 0; i < def.length; i++)
                me._drawTo(context, x, y, def[i].ix, def[i].iy,
                    tiledef.width, tiledef.height);
            return true;
        }
    });

    return TileSheetLarge;

});
