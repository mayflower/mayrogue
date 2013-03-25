// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'tiles', 'tilesets'],
    function(_, Util, Tiles, Tilesets)
{
    "use strict";

    var tilesheetTerrain = new Tilesets.TileSheet({
        url: './res/terrain.gif',
        tileWidth: 32,
        tileHeight: 32,

        mapping: Tiles.compile({
            grass: {ix: 6, iy: 4},
            forest: [Tiles.GRASS, {ix: 9, iy: 4}],
            forest1: [Tiles.GRASS, {ix: 14, iy: 4}],
            forest2: [Tiles.GRASS, {ix: 15, iy: 4}],
            forest3: [Tiles.GRASS, {ix: 16, iy: 4}],
            flower_white: [Tiles.GRASS, {ix: 14, iy: 6 }],
            flower_red: [Tiles.GRASS, {ix: 15, iy: 6 }],
            dirt: {ix: 11, iy: 1},
            stone: {ix: 3, iy: 0}
        })
    });

    var tilesheetActors = new Tilesets.TileSheet({
        url: './res/actors.gif',
        tileWidth: 32,
        tileHeight: 32,
        mapping: Tiles.compile({
            hunter: {ix: 0, iy: 0},
            lichking: {ix: 6, iy: 1},
            ogre: {ix:6, iy: 2},
            spider: {ix: 2, iy:4},
            snake: {ix: 11, iy:1}
        })
    });

    var tilesheetLargeActors = new Tilesets.TileSheetLarge({
        url: './res/actors.gif',
        tileWidth: 32,
        tileHeight: 32,
        mapping: Tiles.compile({
            cthulhu_guy: {ix: 14, iy: 11}
        })
    });

    var tilesheet = new Tilesets.TileSheetCollection({
        members: [tilesheetTerrain, tilesheetActors, tilesheetLargeActors]
    });

    return tilesheet;
});
