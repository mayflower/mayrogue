// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./util');

var Player = Util.extend(Util.Base, {
    properties: [
        {field: '_entity', getter: true},
        {field: '_connection', getter: true}
    ],

    create: function(config) {
        var me = this;
        Util.Base.prototype.create.apply(me, arguments);

        me.getConfig(config, ['connection', 'entity']);
    }
});
