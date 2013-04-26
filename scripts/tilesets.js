// vim:softtabstop=4:shiftwidth=4

/**
 * Namespace for tilesets.
 *
 * A tileset provides shapes for all tiles and can draw them to a canvas.
 */

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
