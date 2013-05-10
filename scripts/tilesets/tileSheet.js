// vim:softtabstop=4:shiftwidth=4

/**
 * Tilesheet. Provides a set of tiles from a spritesheet image.
 *
 * Tile shapes are defined by a mapping definition. The mapping definition
 * is an associative array mapping tile types to arrays of tile positions on the
 * sheet in the 
 *
 */

define(['underscore', 'util', 'tilesets/base'],
    function(_, Util, Base)
{
    "use strict";

    var TileSheet = Util.extend(Base, {
        _mapping: null,
        _url: null,
        _image: null,

        _origin: {x:0, y:0},

        _resolveTile: function(tile, mapping, target) {
            var me = this;

            if (!target) target = [];

            if (_.isArray(tile)) {

                _.each(tile, function(atom) {
                    me._resolveTile(atom, mapping, target);
                });
            } else if (_.isObject(tile)) {

                target.push(tile);
            } else {

                me._resolveTile(mapping[tile], mapping, target);
            }

            return target;
        },

        create: function(config) {
            var me = this;

            me.getConfig(config,
                ['url', 'tileWidth', 'tileHeight', 'mapping']);
            _.defaults(me, {
                width: me._tileWidth,
                height: me._tileHeight
            });

            me._mapping = {};
            _.each(config.mapping, function(def, tile) {
                me._mapping[tile] = me._resolveTile(def, config.mapping);
            });

            me.ready = new Util.Promise();
            me._image = new Image();
            me._image.addEventListener('load', _.bind(me.ready.resolve, me.ready));

            me._image.src = me._url;
        },

        _drawTo: function(context, x, y, ix, iy) {
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

        drawWorldTo: function(context, x, y, tile) {
            var me = this;

            var def = me._mapping[tile];

            if (!def) return false;

            for (var i = 0; i < def.length; i++) {
                var ix = def[i].ix;
                var iy = def[i].iy;

                me._drawTo(context, x, y, ix, iy);
            }
            return true;
        },

        drawEntityTo: function(context, x, y, entity) {
            var me = this;

            var tile = entity.getShape();

            var def = me._mapping[tile];

            if (!def) return false;

            for (var i = 0; i < def.length; i++) {

                if (def[i].heading) {

                    var ix = def[i][entity.getHeading()].ix;
                    var iy = def[i][entity.getHeading()].iy;


                } else {
                    var ix = def[i].ix;
                    var iy = def[i].iy;
                }

                me._drawTo(context, x, y, ix, iy);
                context.fillText("HP: " + entity.getHp(), x, y);
            }
            return true;
        }
    });

    return TileSheet;
});
