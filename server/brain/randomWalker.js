// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ =         require('underscore'),
    Util =      require('../shared/util'),
    Base =      require('./base'),
    Strategy =  require('./strategy');

var _parent = Base.prototype;

var RandomWalker = Util.extend(Base, {
    properties: ['walkPropability', 'trackDistance'],

    _walkPropability: 0.3,
    _trackDistance: 5,
    _strategies: null,

    _strategy: Strategy.RANDOM_WALK,

    create: function() {
        var me = this;
        Base.prototype.create.apply(me, arguments);

        me.getConfig(['walkPropability', 'trackDistance']);
    },

    decorate: function() {
        var me = this;

        _parent.decorate.apply(me, arguments);

        me.getEntity().attachListeners({
            attacked: me._onAttack
        }, me);

        me._addStrategy(new Strategy.RandomWalk({
            entity: me.getEntity(),
            walkPropability: me._walkPropability
        }));

        me._addStrategy(new Strategy.Hunt({
            entity: me.getEntity()
        }));
    },

    _onAttack: function(attacker) {
        var me = this;

        me._setStrategy(Strategy.HUNT).setTarget(attacker);
    },

    _onTick: function() {
        var me = this,
            strategy = me._getStrategy();

        Base.prototype._onTick.apply(me, arguments);

        if (strategy.type == Strategy.HUNT) {
            if (strategy.getPath().length > me._trackDistance) {
                strategy = me._setStrategy(Strategy.RANDOM_WALK);
            }
        }

        me._decide(strategy);
    }
});

module.exports = RandomWalker;
