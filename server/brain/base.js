// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('../shared/util');

var _parent = Util.Base.prototype;

var Base = Util.extend(Util.Base, {
    properties: ['healingRate',
        {field: '_entity', getter: true}
    ],

    _strategies: null,
    _strategy: null,
    _healingRate: 15,

    _counter: 0,

    _onTick: function() {
        var me = this;

        if (me._healingRate > 0 && (me._counter % me._healingRate === 0)) {
            me._entity.getStats().heal(1);
        }

        me._counter++;
    },

    create: function() {
        var me = this;

        _parent.create.apply(me, arguments);

        me._strategies = {};
    },

    decorate: function(entity) {
        var me = this;

        me._entity = entity;
        entity._brain = me;
        entity.getBrain = function() {return this._brain;};
        entity.attachListeners({
            tick: me._onTick
        }, me);
    },

    destroy: function() {
        var me = this;

        if (!me._entity) return;

        me._entity.detachListeners({
            tick: me._onTick
        }, me);

        me._entity._brain = null;
    },

    _decide: function(strategy) {
        var me = this;

        var action = strategy.decide();
        if (action) {
            me._entity.fireEvent('action', action);
        }
    },

    _getStrategy: function() {
        var me = this;

        return me._strategy && me._strategies.hasOwnProperty(me._strategy) ? me._strategies[me._strategy] : null;
    },

    _setStrategy: function(strategy) {
        var me = this;

        me._strategy = strategy;
        return me._getStrategy(strategy);
    },

    _addStrategy: function(strategy) {
        var me = this;

        me._strategies[strategy.type] = strategy;
    }
});

module.exports = Base;
