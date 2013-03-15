define(['underscore', 'util', 'tiles', 'tilesets'],
   function(_, Util, Tiles, Tilesets)
{
   "use strict";

   var tilesheetTerrain = new Tilesets.TileSheet({
      url: './res/terrain.gif',
      tileWidth: 32,
      tileHeight: 32,

      mapping: Tiles.compile({
         forest: {ix: 9, iy: 4},
         forest1: {ix: 14, iy: 4},
         forest2: {ix: 15, iy: 4},
         forest3: {ix: 16, iy: 4},
         flower_white: {ix: 14, iy: 6 },
         flower_red: {ix: 15, iy: 6 },
         grass: {ix: 6, iy: 4},
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
         ogre: {ix:6, iy: 2}
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
