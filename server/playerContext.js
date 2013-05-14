// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util'),
    Geometry = require('./client/geometry');

var positive = function(x) {return x > 0 ? x : 0;};

var PlayerContext = Util.extend(Util.Base, {
    properties: ['entity', 'connection', 'generation', 'trackedEntities', 'trackingDomainScale'],

    _generation: 0,
    _tick: 0,
    _trackingDomainScale: 1.2,

    create: function(config) {
        var me = this;
        Util.Base.prototype.create.apply(me, arguments);

        me.getConfig(config, ['connection', 'entity', 'trackingDomainScale']);

        me._tick = 0;
        me._trackedEntities = {};

        me._entity.attachListeners({
            tick: me._onTick
        }, me);
    },

    _onTick: function() {
        var me = this;

        me._tick++;
        if (me._tick % 10 === 0) me._heal(1);
    },

    /**
     * TODO: this is a questionable place for this logic, should eventually go into a brain-like decorator (together
     * with other stuff like poison, mana regeneration etc.)
     *
     * @param healed
     * @private
     */
    _heal: function(healed) {
        var me = this;

        var stats = me._entity.getStats(),
            hp = stats.getHp();
        hp += healed;
        if (hp > stats.getMaxHp()) hp = stats.getMaxHp();

        stats.setHp(hp);
    },

    /**
     * Determine the domain within which entities are tracked. Currently this is determined by scaling the viewport.
     *
     * TODO: The viewport size is hardcoded BOTH here and in dispatch.js --- bad practice, should eventually become
     * an app-wide parameter
     *
     * @returns {Geometry.Rectangle}
     */
    getTrackingDomain: function() {
        var me = this;
        
        return new Geometry.Rectangle({
            x: positive(me._entity.getX() - Math.floor(20 * me._trackingDomainScale / 2)),
            y: positive(me._entity.getY() - Math.floor(15 * me._trackingDomainScale / 2)),
            width: Math.ceil(20 * me._trackingDomainScale),
            height: Math.ceil(15 * me._trackingDomainScale)
        });
    }
});

module.exports = PlayerContext;
