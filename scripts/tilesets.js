define(['tilesets/tileSheet', 'tilesets/tileSheetLarge',
        'tilesets/tileSheetCollection'],
   function(TileSheet, TileSheetLarge, TileSheetCollection)
{
    "use strict";

    var Tilesets = {
        TileSheet: TileSheet,
        TileSheetLarge: TileSheetLarge,
        TileSheetCollection: TileSheetCollection
    };

    return Tilesets;
});
