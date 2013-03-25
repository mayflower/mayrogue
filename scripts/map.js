// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'tiles'],
    function(_, Util, Tiles)
{

    "use strict";

    var Map = Util.extend(Util.Base, {
        properties: [
            {field: '_data', getter: true},
            {field: '_height', getter: true},
            {field: '_width', getter: true}
        ],

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);

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

    Map.unserialize = function(blob) {
        return new Map({
            width: blob.width,
            height: blob.height,
            data: blob.data
        });
    };

    return Map;

});
