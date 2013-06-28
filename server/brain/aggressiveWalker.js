// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('../shared/util'),
    Base = require('./base'),
    Geometry = require('../shared/geometry');

var AggressiveWalker = Util.extend(Base, {
    properties: ['propability'],

    _propability: 0.3,
    _currentEnemy: null,

    create: function() {
        var me = this;
        Base.prototype.create.apply(me, arguments);

        me.getConfig(['propability']);
    },

    _onTick: function() {
        var me = this;

        Base.prototype._onTick.apply(me, arguments);

        var entity = me._entity;
        var world = entity.getWorld();

        var rect = new Geometry.Rectangle({
            width: 10,
            height: 10,
            x: entity.getX() - 5,
            y: entity.getY() - 5
        });
        var possibleEnemies = _.without(world.entitiesIntersectingWith(rect), entity);

        var enemy = me.chooseEnemy(possibleEnemies);

        if (!enemy) {
            me.lurkAround();
            return;
        }

        me.currentEnemy = enemy;

        var goTo = me.findWayToEnemy(entity, enemy, world);
        if (goTo) me._entity.setXY(goTo.x, goTo.y);

        me.attack(entity, enemy);
    },

    findWayToEnemy: function(entity, enemy, world) {
        var wayPoints = world.findWay(
            { x: entity.getX(), y: entity.getY() },
            { x: enemy.getX(), y: enemy.getY() }
        );

        if (wayPoints && wayPoints.length) {
            var goTo = {
                x: wayPoints[0].position.x,
                y: wayPoints[0].position.y
            };

            if (world.fieldAccessible(goTo.x, goTo.y)) {
                return goTo;
            }
        }

        /*if (entity.getX() < enemy.getX() && world.fieldAccessible(goTo.x + 1, goTo.y, entity)) {
            goTo.x = goTo.x + 1;
            return goTo;
        } else if (entity.getX() > enemy.getX() && world.fieldAccessible(goTo.x - 1, goTo.y, entity)) {
            goTo.x = goTo.x - 1;
            return goTo;
        } else if (entity.getY() < enemy.getY() && world.fieldAccessible(goTo.x, goTo.y + 1, entity)) {
            goTo.y = goTo.y + 1;
            return goTo;
        } else if (entity.getY() > enemy.getY() && world.fieldAccessible(goTo.x, goTo.y - 1, entity)) {
            goTo.y = goTo.y - 1;
            return goTo;
        }*/
        return null;
    },

    attack: function(entity, enemy) {

        var myBox = entity.getBoundingBox();
        var enemyBox = enemy.getBoundingBox();
        var attack = false;

        var eastBox = myBox.clone();
        eastBox.setX(myBox.getX() + 1);
        if (eastBox.intersect(enemyBox)) {
            entity._heading = 'east';
            attack = true;
        }

        var westBox = myBox.clone();
        westBox.setX(myBox.getX() - 1);
        if (westBox.intersect(enemyBox)) {
            entity._heading = 'west';
            attack = true;
        }

        var northBox = myBox.clone();
        northBox.setY(myBox.getY() - 1);
        if (northBox.intersect(enemyBox)) {
            entity._heading = 'north';
            attack = true;
        }

        var southBox = myBox.clone();
        southBox.setY(myBox.getY() + 1);
        if (southBox.intersect(enemyBox)) {
            entity._heading = 'south';
            attack = true;
        }

        if (attack) {
            entity.attack();
        }

    },

    chooseEnemy: function(enemies) {
        var me = this;
        if (!enemies.length) {
            return false;
        }
        _.each(enemies, function(enemy) {
            if (enemy == me._currentEnemy) {
                return enemy;
            }
        });
        return enemies[0];
    },

    lurkAround: function() {
        var me = this;
return;
        if (Math.random() > me._propability) return;

        var dx = 0, dy = 0;
        switch (_.random(3)) {
            case(0):
                dx = 1;
                break;
            case(1):
                dx = -1;
                break;
            case(2):
                dy = 1;
                break;
            case(3):
                dy = -1;
                break;
        }

        me._entity.setXY(me._entity.getX() + dx, me._entity.getY() + dy);
    }

});

module.exports = AggressiveWalker;
