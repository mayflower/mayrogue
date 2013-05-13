// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util'),
    Change = require('./client/change'),
    WorldBase  = require('./client/worldBase'),
    Geometry = require('./client/geometry'),
    EntityManagerServer = require('./entityManagerServer'),
    _ = require('underscore');

var _parent = WorldBase.prototype;

var WorldServer = Util.extend(WorldBase, {

    _changeset: null,

    create: function(config) {
        var me = this;

        if (!config.entityManager) config.entityManager = new EntityManagerServer();

        _parent.create.call(me, config);
        me._changeset = [];
    },

    _onEntityMove: function(entity) {
        var me = this;

        _parent._onEntityMove.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.Movement({
            id: entity.getId(),
            x: entity.getX(),
            y: entity.getY(),
            heading: entity.getHeading()
        }));
    },

    _onEntityStatsChange: function(entity) {
        var me = this;

        _parent._onEntityStatsChange.apply(me, arguments);

        me._changeset.push(new Change.Stats({
            id: entity.getId(),
            hp: entity.getStats().getHp(),
            maxHp: entity.getStats().getMaxHp(),
            exp: entity.getStats().getExp(),
            nextLevelExp: entity.getStats().getNextLevelExp()
        }));
    },

    _onEntityAttack: function(attacker)
    {
        var me = this;
        var rect = attacker.getAttackTarget();

        _.each(me._entityManager.entitiesIntersectingWith(rect), function(entity) {
                var hp = entity.getStats().getHp() - 1;

                entity.getStats().setHp(hp);

                if (hp <= 0) {
                    me._warpEntity(entity);

                    var attackerStats = attacker.getStats();
                    //gain the attacker some exp
                    attackerStats.increaseExp(10);

                    //reset the stats on the attacked (refresh the hp & drop exp)
                    entity.getStats().resetStats();
                }
                

        });
    },

    _warpEntity: function(entity, maxTries) {
        var me = this;

        var boundingBox = entity.getBoundingBox(),
            placement = me.getFreeRandomRect(boundingBox.getWidth(), boundingBox.getHeight(), maxTries);
        if (placement) {
            entity.setXY(placement.getX(), placement.getY());
            return true;
        } else {
            return false;
        }
    },

    addEntity: function(entity) {
        var me = this;

        _parent.addEntity.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.AddEntity({entity: entity}));
    },

    removeEntity: function(entity) {
        var me = this;

        _parent.removeEntity.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.RemoveEntity({entity: entity}));
    },

    pickupChangeset: function() {
        var me = this;

        var changeset = me._changeset;
        me._changeset = [];
        return changeset;
    },

    getFreeRandomRect: function(width, height, maxTries) {
        var me = this,
            rect = null,
            thisTry = 0,
            accessible = false;

        var mapWidth = me._map.getWidth(), mapHeight = me._map.getHeight();

        if (!maxTries) maxTries = 100;

        do {
            rect = new Geometry.Rectangle({
                width: width,
                height: height,
                x: _.random(mapWidth - 1),
                y: _.random(mapHeight - 1)
            });
        } while (!(accessible = me.rectAccessible(rect)) && thisTry++ < maxTries);

        if (accessible) {
            return rect;
        } else {
            return null;
        }
    }

});

module.exports = WorldServer;
