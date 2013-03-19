// vim: set softtabstop=4

var requirejs = require('requirejs'),
    _ = require('underscore'),
    World = require('./world'),
    RandomMap = require('./randomMap');


var Entity = requirejs('entity');
    Tiles = requirejs('tiles');


exports.create = function(config) {
    var height = config.height, width = config.width;

    var size = width * height,
         monsterCount = parseInt(size / 75);

    var map = new RandomMap({
         width: width,
         height: height
    });

    var entities = [];
    _.times(monsterCount, function(index) {
        var shape = _.random(Tiles.LICHKING, Tiles.CTHULHU_GUY),
            entity;

        do {
             entity = new Entity({
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
}
