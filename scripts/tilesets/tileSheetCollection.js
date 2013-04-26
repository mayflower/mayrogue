// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'tilesets/base'],
    function(_, Util, Base)
{

     "use strict";

     var TileSheetCollection = Util.extend(Base, {
        _members: null,
        
        _semaphore: null,

        create: function(config) {
            var me = this;

            Base.prototype.create.apply(me, arguments);

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

            return me;
        },

        setHeight: function(height) {
            var me = this;

            me.height = height;
            _.each(me._members, function(tilesheet) {
                tilesheet.setHeight(height);
            });

            return me;
        },

         drawWorldTo: function(context, x, y, tile) {
             return _.some(this._members, function(tilesheet) {
                 return tilesheet.drawWorldTo(context, x, y, tile);
             });
         },

        drawEntityTo: function(context, x, y, entity) {
            return _.some(this._members, function(tilesheet) {
                return tilesheet.drawEntityTo(context, x, y, entity);
            });
        },

        getTileWidth: function() {
            var me = this;

            if (me._members.length > 0) return me._members[0].getTileWidth();
            return null;
        },

        getTileHeight: function() {
            var me = this;

            if (me._members.length > 0) return me._members[0].getTileHeight;
            return null;
        }
    });

    return TileSheetCollection;

});
