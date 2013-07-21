// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('../shared/util');

var Base = Util.extend(Util.Base, {
    properties: [
        {field: '_entity', getter: true}
    ],

    _onTick: function() {},

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

        var action = strategy.decide(me._entity);
        if (action) {
            me._entity.fireEvent('action', action);
        }
    }
});

module.exports = Base;
