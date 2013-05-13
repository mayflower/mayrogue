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

    create: function(config) {
        var me = this;

        if (!config.entityManager) config.entityManager = new EntityManagerServer();

        _parent.create.call(me, config);
    },

    _onEntityAttack: function(attacker)
    {
        var me = this;
        var rect = attacker.getAttackTarget();

        _.each(me._entityManager.entitiesIntersectingWith(rect), function(entity) {
                var hp = entity.getStats().getHp() - 1;

                if (hp <= 0) {
                    me._warpEntity(entity);
                    hp = entity.getStats().getMaxHp();
                }
                
                entity.getStats().setHp(hp);
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

        return me._entityManager.getChangesetForEntity();
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
