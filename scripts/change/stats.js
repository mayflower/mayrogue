// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base', 'change/types'],
    function(_, Util, Base, Types)
    {
        "use strict";

        var Stats = Util.extend(Base, {
            properties: ['hp', 'id'],

            type: Types.STATS,

            create: function(config) {
                var me = this;
                Base.prototype.create.apply(me, arguments);

                me.getConfig(config, ['hp', 'id']);
            },

            apply: function(world, stale) {
                var me = this;
                if (stale && me._id === world.getPlayer().getId()) {
                    return;
                }

                var entity = world.getEntityById(me._id);
                if (entity) {
                    entity.setHp(me._hp);
                }
            },

            serialize: function() {
                var me = this;

                return {
                    hp: me._hp,
                    id: me._id
                };
            }
        });

        Stats.unserialize = function(blob) {
            return new Stats(blob);
        };

        return Stats;
    });