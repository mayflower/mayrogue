define(['underscore', 'util'],
    function(_, Util)
{
    "use strict";

    var Stats = Util.extend(Util.Base, {
        properties: [
            'hp',
            'maxHp',
            'name',
            'exp',
            'damage',
            'lvl',
            'nextLevelExp',
            'hasExp',
            'lvlUp'
        ],

        mixins: [Util.Observable],

        _hp: 0,
        _maxHp: 0,
        _name: '',
        _exp: 0,
        _dmg: 0,
        _lvl: 1,
        _nextLevelExp: 100,
        _hasExp: false,
        _lvlUp: false,

        create: function(config) {
            var me = this;

            Util.Observable.prototype.create.apply(me, arguments);
            Util.Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['hp', 'maxHp', 'name', 'exp', 'damage', 'lvl', 'nextLevelExp', 'hasExp', 'lvlUp']);
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

        increaseExp: function(exp) {
            var me = this;

            if(me._hasExp) {
                me.setExp(me._exp + exp);
            }
        },

        setExp: function(exp) {
            var me = this;

            me._lvlUp = false;
            //check if the entity can increase his experience
            if(me._hasExp) {
                if (exp != me._exp) {
                    me._exp = exp;

                     if(me._hasNewLevel()) {
                        //level up
                        me._levelUp();
                    }

                    me.fireEvent('change');
                }
            }
        },

        _levelUp: function() {
            var me = this;

            //@todo maybe it should be a x^2 or something like this
            me._nextLevelExp += 100;
            me._lvl++;
            me._lvlUp = true;
            //increase max heal points
            me.setMaxHp((me._lvl + 1) * 10);
            if(me._damage < 3) {
                me._damage++;
            }

            //auto heal after level up
            me._hp = me._maxHp;
            me.fireEvent('levelUp');
            me.fireEvent('change');
        },

        _hasNewLevel: function() {
            var me = this;

            if(( me._exp - me._nextLevelExp) >= 0) {
                me._lvlUp = true;
            }

            return me._lvlUp;
        },

        resetStats: function() {
            var me = this;
            me._hp = me._maxHp;

            //remove all not for leveling used exp
            if(me._hasExp) {
                me._exp = (me._lvl -1) * 100;
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
                damage: me._damage,
                lvl: me._lvl,
                nextLevelExp: me._nextLevelExp,
                hasExp: me._hasExp,
                lvlUp: me._lvlUp
            };
        }
    });

    Stats.unserialize = function(blob) {
        return new Stats(blob);
    };

    return Stats;
});