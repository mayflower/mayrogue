// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./util');

var PlayerContext = Util.extend(Util.Base, {
    properties: ['entity', 'connection', 'generation'],

    _generation: 0,

    create: function(config) {
        var me = this;
        Util.Base.prototype.create.apply(me, arguments);

        me.getConfig(config, ['connection', 'entity'])
    }
});

module.exports = PlayerContext;
