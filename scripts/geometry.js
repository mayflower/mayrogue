// vim:softtabstop=4:shiftwidth=4

/**
 * Namespace for the various geometries.
 */

define(['underscore', 'util', 'geometry/rectangle'],
    function(_, Util, Rectangle)
{
    "use strict";

    var Geometry = {
        Rectangle: Rectangle
    };

    return Geometry;
});
