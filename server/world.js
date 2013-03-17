// vim: set softtabstop=4

var requirejs = require('requirejs'),
    _ = require('underscore');

var Util = requirejs('util'),
    WorldShared = requirejs('world'),
    Tiles = requirejs('tiles');

var World = Util.extend(WorldShared.WorldBase, {
});

World.createRandom = function(width, height) {
    var size = width * height,
         monsterCount = parseInt(size / 75);

    var map = new WorldShared.RandomMap({
         width: width,
         height: height
    });

    var entities = [];
    _.times(monsterCount, function(index) {
        var shape = _.random(Tiles.LICHKING, Tiles.CTHULHU_GUY),
            entity;

        do {
             entity = new WorldShared.Entity({
                x: _.random(width - 1),
                y: _.random(height - 1),
                shape: shape,
                id: index + 1
            });
        } while(!map.fieldAccessible(entity.getX(), entity.getY()));

         entities.push(entity);
    });

    var world = new World({
        map: map,
        entities: entities,
    });

    return world;
};

exports = module.exports = World;
