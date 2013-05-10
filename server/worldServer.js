// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util'),
    Change = require('./client/change'),
    WorldBase  = require('./client/worldBase'),
    Geometry = require('./client/geometry'),
    _ = require('underscore');

var WorldServer = Util.extend(WorldBase, {

    _changeset: null,

    create: function() {
        var me = this;

        WorldBase.prototype.create.apply(me, arguments);
        me._changeset = [];
    },

    _onEntityChange: function(entity) {
        var me = this;

        WorldBase.prototype._onEntityChange.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.Movement({
            id: entity.getId(),
            x: entity.getX(),
            y: entity.getY(),
            heading: entity.getHeading()
        }));

        me._changeset.push(new Change.Stats({
            id: entity.getId(),
            hp: entity.getHp()
        }));
    },

    _onEntityAttack: function(attacker)
    {
        var me = this;
        var attackTarget = attacker.getAttackTarget();
        var rect = new Geometry.Rectangle({x: attackTarget.x, y: attackTarget.y, width: 1, height: 1});
        _.each(me._entities, function(entity) {
            if (rect.intersect(entity.getBoundingBox())) {
                var hp = entity.getHp() - 1;
                if (hp <= 0) {
                    me._warpEntity(entity);
                } else {
                    entity.setHp(hp);
                }
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

        WorldBase.prototype.addEntity.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.AddEntity({entity: entity}));
    },

    removeEntity: function(entity) {
        var me = this;

        WorldBase.prototype.removeEntity.apply(me, arguments);

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
        } while (!(accessible = me._map.rectAccessible(rect)) && thisTry++ < maxTries);

        if (accessible) {
            return rect;
        } else {
            return null;
        }
    }
});

module.exports = WorldServer;
