// vim:softtabstop=4:shiftwidth=4

"use strict";


var _ =         require('underscore'),
    Util =      require('../shared/util'),
    Base =      require('./base'),
    Strategy =  require('./strategy'),
    Geometry =  require('../shared/geometry');

var _parent = Base.prototype;

var AggressiveWalker = Util.extend(Base, {
    properties: ['walkPropability', 'trackDistance', 'sightDistance'],

    _walkPropability: 0.3,
    _trackDistance: 6,
    _sightDistance: 5,

    _strategy: Strategy.RANDOM_WALK,

    create: function() {
        var me = this;
        _parent.create.apply(me, arguments);

        me.getConfig(['walkPropability', 'trackDistance', 'sightDistance']);
    },

    decorate: function() {
        var me = this;

        _parent.decorate.apply(me, arguments);

        me._addStrategy(new Strategy.RandomWalk({
            entity: me.getEntity(),
            walkPropability: me._walkPropability
        }));

        me._addStrategy(new Strategy.Hunt({
            entity: me.getEntity(),
            attackPropability: 0.9,
            trackPropability: 0.9
        }));

        me.getEntity().attachListeners({
            attacked: me._onAttack
        }, me);
    },

    _onAttack: function (attacker) {
        var me = this;

        me._setStrategy(Strategy.HUNT).setTarget(attacker);
    },

    _findPossibleEnemies: function() {
        var me = this,
            entity = me.getEntity(),
            sightRect = new Geometry.Rectangle({
                width:  2 * me._sightDistance,
                height: 2 * me._sightDistance,
                x: entity.getX() - me._sightDistance,
                y: entity.getY() - me._sightDistance
            });

        return _.without(entity.getWorld().entitiesIntersectingWith(sightRect), entity);
    },

    _tryToHunt: function() {
        var me = this,
            possibleEnemies = me._findPossibleEnemies(),
            strategy = me._getStrategy(),
            currentTarget;

        if (strategy.type == Strategy.HUNT && (currentTarget = strategy.getTarget())) {
            possibleEnemies = _.without(possibleEnemies, currentTarget);
        }

        if (possibleEnemies.length > 0) {
            me._setStrategy(Strategy.HUNT).setTarget(possibleEnemies[_.random(possibleEnemies.length - 1)]);
            return true;
        } else {
            return false;
        }
    },

    _onTick: function() {
        var me = this,
            oldStrategy = me._getStrategy(),
            path;

        Base.prototype._onTick.apply(me, arguments);

        if (oldStrategy.type == Strategy.RANDOM_WALK) {
            oldStrategy = null;

        } else if (oldStrategy.type == Strategy.HUNT) {

            path = oldStrategy.getPath();
            if (path.length > me._trackDistance || path.length === 0) {
                oldStrategy = null;
            }
        }

        if (!oldStrategy && !me._tryToHunt()) {
            me._setStrategy(Strategy.RANDOM_WALK);
        }

        me._decide(me._getStrategy());
    }
});

module.exports = AggressiveWalker;
