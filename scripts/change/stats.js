// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/base', 'change/types'],
    function(_, Util, Base, Types)
    {
        "use strict";

        var Stats = Util.extend(Base, {
            properties: ['hp', 'id', 'exp', 'nextLevelExp', 'damage', 'maxHp', 'lvl'],

            type: Types.STATS,

            create: function(config) {
                var me = this;
                Base.prototype.create.apply(me, arguments);

                me.getConfig(config, ['hp', 'id', 'exp', 'nextLevelExp', 'damage', 'maxHp', 'lvl']);
            },

            apply: function(world) {
                var me = this;

                var entity = world.getEntityById(me._id);
                if (entity) {
                    entity.getStats().setHp(me._hp);
                    entity.getStats().setExp(me._exp);
                    entity.getStats().setMaxHp(me._maxHp);
                    entity.getStats().setNextLevelExp(me._nextLevelExp);
                }
            },

            serialize: function() {
                var me = this;

                return {
                    hp: me._hp,
                    id: me._id,
                    exp: me._exp,
                    nextLevelExp: me._nextLevelExp,
                    damage: me._damage,
                    maxHp: me._maxHp,
                    lvl: me._lvl
                };
            }
        });

        Stats.unserialize = function(blob) {
            return new Stats(blob);
        };

        return Stats;
    });