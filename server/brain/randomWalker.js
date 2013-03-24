// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('../util'),
    Base = require('./base');

var RandomWalker = Util.extend(Base, {
    properties: ['propability'],

    _propability: 0.3,

    create: function() {
        var me = this;
        Base.prototype.create.apply(me, arguments);

        me.getConfig(['propability']);
    },

    _onTick: function() {
        var me = this;
        Base.prototype._onTick.apply(me, arguments);

        if (Math.random() > me._propability) return;

        var dx = _.random(2) - 1;
        var dy = _.random(2) - 1;
        me._entity.setXY(me._entity.getX() + dx, me._entity.getY() + dy);
    }
});

module.exports = RandomWalker;
