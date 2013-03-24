// vim: set softtabstop=4

"use strict";

var _ = require('underscore'),
    Util = require('../util');

var Base = Util.extend(Util.Base, {
    properties: [
        {field: '_entity', getter: true}
    ],

    _onTick: function() {},

    decorate: function(entity) {
        var me = this;

        me._entity = entity;
        entity._brain = me;
        entity.getBrain = function() {return this._brain};
        entity.attachListeners({
            tick: me._onTick
        }, me);
    },

    destroy: function() {
        var me = this;

        if (!me._entity) return;

        me._entity._brain = null;
        entity.detachListeners({
            tick: _onTick
        }, me);
    }
});

module.exports = Base;
