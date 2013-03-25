// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base', 'change/types', 'entity'],
    function(_, Util, Base, Types, Entity)
{
    "use strict";

    var RemoveEntity = Util.extend(Base, {
        properties: ['id'],

        type: Types.REMOVE_ENTITY,

        create: function(config) {
            var me = this;
            Base.prototype.create.apply(me, arguments);

            if (config.entity) {
                me._id = config.entity.getId();
            } else {
                me._id = config.id;
            }
        },

        apply: function(world) {
            var me = this;

            world.removeEntity(world.getEntityById(me._id));
        },
        
        serialize: function() {
            var me = this;

            return me._id;
        }
    });

    RemoveEntity.unserialize = function(blob) {
        return new RemoveEntity({id: blob});
    };

    return RemoveEntity;
});
