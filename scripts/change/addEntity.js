// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base', 'entity'],
    function(_, Util, Base, Entity)
{
    "use strict";

    var AddEntity = Util.extend(Base, {
        properties: ['entity'],

        create: function(config) {
            var me = this;
            Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['entity']);
        },

        apply: function(world) {
            var me = this;

            if (!world.getEntityById(me._entity.getId()))
                world.addEntity(me._entity);
        },
        
        serialize: function() {
            var me = this;

            return me._entity.serialize();
        }
    });

    AddEntity.unserialize = function(blob) {
        return new AddEntity({entity: Entity.unserialize(blob)});
    };

    return AddEntity;
});
