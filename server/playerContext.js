// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util');

var PlayerContext = Util.extend(Util.Base, {
    properties: ['entity', 'connection', 'generation'],

    _generation: 0,
    _tick: 0,

    create: function(config) {
        var me = this;
        Util.Base.prototype.create.apply(me, arguments);

        me.getConfig(config, ['connection', 'entity']);

        this._tick = 0;
    },

    tick: function() {
        var me = this;

        me._tick++;
        if (me._tick % 10 === 0) me._heal(1);
    },

    _heal: function(healed) {
        var me = this;

        var stats = me._entity.getStats(),
            hp = stats.getHp();
        hp += healed;
        if (hp > stats.getMaxHp()) hp = stats.getMaxHp();

        stats.setHp(hp);
    }
});

module.exports = PlayerContext;
