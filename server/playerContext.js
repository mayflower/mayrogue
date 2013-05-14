// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util'),
    Geometry = require('./client/geometry');

var positive = function(x) {return x > 0 ? x : 0;};

var PlayerContext = Util.extend(Util.Base, {
    properties: ['entity', 'connection', 'generation', 'trackedEntities', 'relevanceDomainScale'],

    _generation: 0,
    _tick: 0,
    _relevanceDomainScale: 1.2,

    create: function(config) {
        var me = this;
        Util.Base.prototype.create.apply(me, arguments);

        me.getConfig(config, ['connection', 'entity', 'relevanceDomainScale']);

        me._tick = 0;
        me._trackedEntities = {};
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
    },

    getRelevanceDomain: function() {
        var me = this;
        
        return new Geometry.Rectangle({
            x: positive(me._entity.getX() - Math.floor(20 * me._relevanceDomainScale / 2)),
            y: positive(me._entity.getY() - Math.floor(15 * me._relevanceDomainScale / 2)),
            width: Math.ceil(20 * me._relevanceDomainScale),
            height: Math.ceil(15 * me._relevanceDomainScale)
        });
    }
});

module.exports = PlayerContext;
