// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ =         require('underscore'),
    Util =      require('../shared/util'),
    Base =      require('./base'),
    Strategy =  require('./strategy');

var RandomWalker = Util.extend(Base, {
    properties: ['walkPropability'],

    _walkPropability: 0.3,
    _strategy: null,

    create: function() {
        var me = this;
        Base.prototype.create.apply(me, arguments);

        me.getConfig(['walkPropability']);
        me._strategy = new Strategy.RandomWalk({
            walkPropability: me._walkPropability
        });
    },

    _onTick: function() {
        var me = this;
        Base.prototype._onTick.apply(me, arguments);

        me._decide(me._strategy);
    }
});

module.exports = RandomWalker;
