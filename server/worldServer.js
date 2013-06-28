// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./shared/util'),
    WorldBase  = require('./shared/worldBase'),
    Geometry = require('./shared/geometry'),
    EntityManagerServer = require('./entityManagerServer'),
    Entity = require('./shared/entity'),
    _ = require('underscore'),
    gamlib = require('./vendor/gamlib-ai');

var _parent = WorldBase.prototype;

var WorldServer = Util.extend(WorldBase, {

    _grid: null,

    create: function(config) {
        var me = this;

        if (!config.entityManager) config.entityManager = new EntityManagerServer();

        _parent.create.call(me, config);

        var width = me.getMap().getWidth(),
            height = me.getMap().getHeight();

        me._grid = new gamlib.AStarArray(width, height);

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                // set fields as inaccessible for gamlib

                if (!me.getMap().fieldAccessible(x, y)) {
                    me._grid.setValue(x, y, -1);
                }
            }
        }

        // register for move events to move inaccessible parts
        config.entityManager.attachListeners({ move: me._onEntityMove }, me);
    },

    findWay: function(start, finish) {
        var me = this;


        return me._grid.find(start.x, start.y, finish.x, finish.y);
    },

    _onEntityMove: function(oldBoundingBox, newBoundingBox) {
        var me = this;

        // ._x ._y ._width ._height
        me._setGridBoundingBoxValue(oldBoundingBox, 0);
        me._setGridBoundingBoxValue(newBoundingBox, -1);
    },

    _setGridBoundingBoxValue: function(boundingBox, value)
    {
        var me = this,
            x = boundingBox.getX(),
            y = boundingBox.getY(),
            x2 = x + boundingBox.width,
            y2 = y - boundingBox.height;

        for (var i = x; i < x2; i++) {
            for (var j = y; j < y2; j++) {
                me._grid.setValue(i, j, value);
            }
        }
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

                    if (attacker.getRole() === Entity.Role.PLAYER) {
                        var receivedExp = me._getReceivedExp(attacker, entity),
                            exp = attacker.getStats().getExp() + receivedExp,
                            neededExp = attacker.getStats().getNeededExp();

                        if (exp >= neededExp) {
                            attacker.getStats().setLevel(attacker.getStats().getLevel() + 1);
                        }
                        attacker.getStats().setExp(exp);
                    }
                }
                
                entity.getStats().setHp(hp);
        });
    },

    _getReceivedExp: function(attacker, entity) {
        var multiplier = entity.getRole() === Entity.Role.PLAYER ? 1.5 : 1,
            basicExp = entity.getRole() === Entity.Role.PLAYER ? 10 : 5,
            entityLevel = entity.getStats().getLevel() || 1,
            attackerLevel = attacker.getStats().getLevel() || 1;

        return Math.ceil(
            multiplier * basicExp * entityLevel / 5 *
            Math.pow(2 * entityLevel + 10, 2.5) /
            Math.pow(entityLevel + attackerLevel + 10, 2.5) + 1
        );
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

    pickupChangeset: function(player) {
        var me = this;

        return me._entityManager.pickupChangeset(player);
    },

    clearChanges: function() {
        this._entityManager.clearChanges();
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
                x: _.random(mapWidth - width),
                y: _.random(mapHeight - height)
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
