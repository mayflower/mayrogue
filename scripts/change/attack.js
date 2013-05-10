// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base', 'change/types'],
    function(_, Util, Base, Types)
{
    "use strict";

    var Attack = Util.extend(Base, {
        properties: ['x', 'y', 'id'],

        type: Types.ATTACK,

        create: function(config) {
            var me = this;
            Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['x', 'y', 'id']);
        },

        apply: function(world, stale) {
            var me = this;
            if (stale && me._id === world.getPlayer().getId()) {
                return;
            }

            var entity = world.getEntityById(me._id);
            if (entity) {
                entity.setXY(me._x, me._y);
            }
        },

        serialize: function() {
            var me = this;

            return {
                x: me._x,
                y: me._y,
                id: me._id
            };
        }
    });

    Attack.unserialize = function(blob) {
        return new Attack(blob);
    };

    return Attack;
});
