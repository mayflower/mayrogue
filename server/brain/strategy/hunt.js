'use strict';

var _ =         require('underscore'),
    Util =      require('../../shared/util'),
    Base =      require('./base'),
    Action =    require('../../action');


var randomChoice = function(probability) {
    if (probability < 1) {
        return Math.random() < probability;
    } else {
        return true;
    }
};

var _parent = Base.prototype;

var Hunt = Util.extend(Base, {
    properties: ['target', 'attackProbability', 'trackProbability',
        {field: '_path', getter: true}
    ],

    _path: null,
    _target: null,

    _trackProbability: 0.8,
    _attackProbability: 0.5,

    create: function(config) {
        var me = this;

        _parent.create.apply(me, arguments);

        me.getConfig(config, ['target', 'trackProbability', 'attackProbability']);
    },

    setTarget: function(target) {
        var me = this,
            entity = me.getEntity();

        me._target = target;
        me._path = entity.getWorld().findWay(entity.getX(), entity.getY(), target.getX(), target.getY());

        return me;
    },

    decide: function() {
        var me = this,
            entity = me.getEntity(),
            world = entity.getWorld(),
            entityX = entity.getX(),
            entityY = entity.getY();

        if (!me._target) {
            return null;
        }

        if (entity.getAttackTarget().intersect(me._target.getBoundingBox())) {
            return randomChoice(me._attackProbability) ? new Action.Attack() : null;
        }

        me._path = world.findWay(entityX, entityY, me._target.getX(), me._target.getY());
        if (me._path.length > 1) {
            if (me._path[1].x != entityX) {
                return randomChoice(me._trackProbability) ? new Action.Move({deltaX: me._path[1].x - entityX}) : null;
            }
            if (me._path[1].y != entityY) {
                return randomChoice(me._trackProbability) ? new Action.Move({deltaY: me._path[1].y - entityY}) : null;
            }
        }

        return null;
    }
});

module.exports = Hunt;