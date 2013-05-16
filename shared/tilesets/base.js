// vim:softtabstop=4:shiftwidth=4

/**
 * Tileset base. Defines a standard set of properties shared by all Tilesets.
 */

define(['underscore', 'util'],
    function(_, Util)
{
    "use strict";

    var Base = Util.extend(Util.Base, {
        properties: [
            {field: 'height', setter: true},
            {field: 'width', setter: true},
            {field: '_tileWidth', getter: true},
            {field: '_tileHeight', getter: true}
        ],

        ready: null
    });

    return Base;

});
