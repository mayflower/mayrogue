// vim: set softtabstop=4

"use strict";

var _ = require('underscore'),
    Util = require('../util');

var RandomWalker = Util.extend(Util.Base, {
    properties: ['propability',
        {field: '_entity', getter: true}
    ],

    _propability: 0.3,

    create: function() {
        var me = this;

        me.getConfig(['propability']);
    },

    _onTick: function() {
        var me = this;

        if (Math.random() > me._propability) return;

        var dx = _.random(2) - 1;
        var dy = _.random(2) - 1;
        me._entity.setXY(me._entity.getX() + dx, me._entity.getY() + dy);
    },

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

module.exports = RandomWalker;
