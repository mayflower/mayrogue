// vim: set softtabstop=4

"use strict";

var _ = require('underscore'),
    Util = require('./util'),
    World = require('./world'),
    RandomMap = require('./randomMap'),
    Brain = require('./brain'),
    Entity = require('./entity'),
    Tiles = require('./tiles');

var RandomWorld = Util.extend(World, {
    _nextId: 0,

    create: function(config) {
        var me = this;

        var size = config.width * config.height,
             monsterCount = parseInt(size / 75);

        World.prototype.create.call(me, _.extend({
            map: new RandomMap(config)
        }, config));

        _.times(monsterCount, function(index) {
            var shape = _.random(Tiles.LICHKING, Tiles.CTHULHU_GUY);

            var entity = me.addNewRandomEntity({
                shape: shape
            });
            
            (new Brain.RandomWalker()).decorate(entity);
        });
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
