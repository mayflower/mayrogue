// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    WorldServer = require('./worldServer'),
    RandomMap = require('./randomMap'),
    Brain = require('./brain'),
    Entity = require('./client/entity'),
    Tiles = require('./client/tiles'),
    Geometry = require('./client/geometry');

var RandomWorld = Util.extend(WorldServer, {
    _nextId: 0,

    create: function(config) {
        var me = this;

        var size = config.width * config.height,
             monsterCount = parseInt(size / 75, 10);

        WorldServer.prototype.create.call(me, _.extend({
            map: new RandomMap(config)
        }, config));

        _.times(monsterCount, function() {
            var shape = _.random(Tiles.LICHKING, Tiles.CTHULHU_GUY);

            var entity = me.addNewRandomEntity({
                shape: shape,
                hp: 10
            });
            
            (new Brain.RandomWalker()).decorate(entity);
        });

        me.pickupChangeset();
    },

    addNewRandomEntity: function(config) {
        var me = this;
        
        var entity = new Entity(_.extend(config, {
            id : me._nextId++,
            x: 0,
            y: 0
        }));

        var boundingBox = entity.getBoundingBox();
        var placement = me.getFreeRandomRect(boundingBox.getWidth(), boundingBox.getHeight());

        if (placement) {
            entity.setXY(placement.getX(), placement.getY());
            me.addEntity(entity);
        }

        return entity;
    }
});

module.exports = RandomWorld;
