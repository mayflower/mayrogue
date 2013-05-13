define(['underscore', 'util', 'entityManagerBase'],
    function(_, Util, EntityManagerBase)
{
    "use strict";

    var _parent = EntityManagerBase.prototype;

    var EntityManagerClient = Util.extend(EntityManagerBase, {
        properties: [
            {field: '_world', getter: true}
        ],

        create: function(config) {
            var me = this;

            me.getConfig(config, ['world']);

            _parent.create.apply(me, arguments);
        },

        addEntity: function(entity) {
            var me = this,
                player = me._world.getPlayer();

            if (player && player !== entity && !entity.getBoundingBox().intersect(me._getRelevanceDomain(player))) {
                return;
            }

            _parent.addEntity.apply(me, arguments);
        }
    });

    return EntityManagerClient;
});