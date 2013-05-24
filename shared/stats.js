define(['underscore', 'util'],
    function(_, Util)
{
    "use strict";

    var Stats = Util.extend(Util.Base, {
        properties: ['hp', 'maxHp', 'name', 'damage', 'exp', 'level'],

        mixins: [Util.Observable],

        _hp: 0,
        _maxHp: 0,
        _name: '',
        _dmg: 0,

        _exp: 0,
        _level: 1,

        create: function(config) {
            var me = this;

            Util.Observable.prototype.create.apply(me, arguments);
            Util.Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['hp', 'maxHp', 'name', 'exp', 'damage']);
        },

        setHp: function(hp) {
            var me = this;

            if (hp != me._hp) {
                me._hp = hp;
                me.fireEvent('change');
            }
        },

        setMaxHp: function(maxHp) {
            var me = this;

            if (maxHp != me._maxHp) {
                me._maxHp = maxHp;
                me.fireEvent('change');
            }
        },


        setName: function(name) {
            var me = this;

            if (name != me._name) {
                me._name = name;
                me.fireEvent('change');
            }
        },

        setExp: function(exp) {
            var me = this;

            if (exp != me._exp) {
                me._exp = exp;
                me.fireEvent('change');
            }
        },

        setDamage: function(damage) {
            var me = this;

            if (damage != me._damage) {
                me._damage = damage;
                me.fireEvent('change');
            }
        },

        serialize: function() {
            var me = this;

            return {
                hp: me._hp,
                maxHp: me._maxHp,
                name: me._name,
                exp: me._exp,
                damage: me._damage
            };
        },

        getNeededExp: function() {
            var me = this;
            return Math.floor(4 * Math.pow((me._level || 1) + 1, 3) / 5);
        }
    });

    Stats.unserialize = function(blob) {
        return new Stats(blob);
    };

    return Stats;
});