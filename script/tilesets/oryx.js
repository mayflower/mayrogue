define(['lib/underscore', 'util', 'tiles', 'tilesets'],
   function(_, Util, Tiles, Tilesets)
{
   var tilesheetTerrain = new Tilesets.TileSheet({
      url: './res/terrain.gif',
      tileWidth: 32,
      tileHeight: 32,

      mapping: Tiles.compile({
         forest: {ix: 9, iy: 4},
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

   var tilesheet = new Tilesets.TileSheetCollection({
      members: [tilesheetTerrain, tilesheetActors]
   });

   return tilesheet;
});
