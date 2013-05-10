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

        var dx = 0, dy = 0;
        switch (_.random(3)) {
            case(0):
                dx = 1;
                break;
            case(1):
                dx = -1;
                break;
            case(2):
                dy = 1;
                break;
            case(3):
                dy = -1;
                break;
        }

        me._entity.setXY(me._entity.getX() + dx, me._entity.getY() + dy);
    }
});

module.exports = RandomWalker;
