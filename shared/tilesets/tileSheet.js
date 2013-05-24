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

        getTextureCoords: function(tileId, entity) {
            var me = this;
            var def = me._mapping[tileId];

            if (def.length !== 1) {
                //console.log(def.length);
                //console.log("multi-tiles "+def.length+" per tile is not yet supported");
            }

            var realDef = def[0];

            if (def[0].heading && entity !== undefined) {
                realDef = def[0][entity.getHeading()];
            }

            return {
                x: realDef.ix * me._tileWidth / me._image.width,
                y: realDef.iy * me._tileWidth / me._image.height,
                w: me._tileWidth / me._image.width,
                h: me._tileHeight / me._image.height
            };
        },

        isMapping: function(tileId) {
            var me = this;
            return me._mapping[tileId] !== undefined;
        },

        drawEntityTo: function(context, x, y, entity) {
            var me = this;

            var tile = entity.getShape();

            var def = me._mapping[tile];

            if (!def) return false;

            var ix, iy;
            for (var i = 0; i < def.length; i++) {

                if (def[i].heading) {

                    ix = def[i][entity.getHeading()].ix;
                    iy = def[i][entity.getHeading()].iy;


                } else {
                    ix = def[i].ix;
                    iy = def[i].iy;
                }

                me._drawTo(context, x, y, ix, iy);
            }

            me._drawEntityStats(context, x, y, entity);

            return true;
        },

        _drawEntityStats: function(context, x, y, entity) {
            //noinspection JSUnusedLocalSymbols
            var me = this,
                stats = entity.getStats();

            var name = stats.getName(),
                text = '';
            if (name) text += (name + ', ');
            text += ("HP: " + entity.getStats().getHp());

            context.fillText(text, x, y);
        }
    });

    return TileSheet;
});
