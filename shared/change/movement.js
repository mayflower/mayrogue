// vim:softtabstop=4:shiftwidth=4

/**
 * Movement.
 */

define(['underscore', 'util', 'change/base', 'change/types'],
    function(_, Util, Base, Types)
{
    "use strict";

    var Movement = Util.extend(Base, {
        properties: ['x', 'y', 'id', 'heading'],

        type: Types.MOVEMENT,

        create: function(config) {
            var me = this;
            Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['x', 'y', 'id', 'heading']);
        },

        /**
         * If a movement of the player entity is stale, we discard it --- avoids
         * jumping in case of pending requests.
         */
        apply: function(world, stale) {
            var me = this;

            if (stale && me._id === world.getPlayer().getId()) {
                return;
            }

            var entity = world.getEntityById(me._id);
            if (entity) {
                entity.setXY(me._x, me._y, true);
                entity.setHeading(me._heading);
            }
        },

        serialize: function() {
            var me = this;

            return {
                x: me._x,
                y: me._y,
                id: me._id,
                heading: me._heading
            };
        }
    });

    Movement.unserialize = function(blob) {
        return new Movement(blob);
    };

    return Movement;
});
