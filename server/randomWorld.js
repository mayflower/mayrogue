// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    World = require('./worldServer'),
    RandomMap = require('./randomMap'),
    Brain = require('./brain'),
    Entity = require('./client/entity'),
    Tiles = require('./client/tiles');

var RandomWorld = Util.extend(World, {
    _nextId: 0,

    create: function(config) {
        var me = this;

        var size = config.width * config.height,
             monsterCount = parseInt(size / 75, 10);

        World.prototype.create.call(me, _.extend({
            map: new RandomMap(config)
        }, config));

        _.times(monsterCount, function() {
            var shape = _.random(Tiles.LICHKING, Tiles.CTHULHU_GUY);

            var entity = me.addNewRandomEntity({
                shape: shape
            });
            
            (new Brain.RandomWalker()).decorate(entity);
        });

        me.pickupChangeset();
    },

    _freeRandomPos: function() {
        var me = this;
        var x, y;
        var width = me._map.getWidth(), height = me._map.getHeight();

        do {
            x = _.random(width - 1);
            y = _.random(height - 1);
        } while (!me._map.fieldAccessible(x, y));
        return {x: x, y: y};
    },

    addNewRandomEntity: function(config) {
        var me = this;
        var randomPos = me._freeRandomPos();
        
        var entity = new Entity(_.extend(config, {
            id : me._nextId++,
            x: randomPos.x,
            y: randomPos.y
        }));

        me.addEntity(entity);
        return entity;
    }
});

module.exports = RandomWorld;
