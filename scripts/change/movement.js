// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base'],
    function(_, Util, Base)
{
    "use strict";

    var Movement = Util.extend(Base, {
        _x: null,
        _y: null,
        _id: null,

        create: function(config) {
            var me = this;
            Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['x', 'y', 'id']);
        },

        apply: function(world) {
            var me = this;

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

    Movement.unserialize = function(blob) {
        return new Movement(blob);
    };

    return Movement;
});
