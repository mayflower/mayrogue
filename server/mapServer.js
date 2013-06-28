// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./shared/util'),
    MapBase  = require('./shared/map'),
    _ = require('underscore'),
    gamlib = require('./vendor/gamlib-ai');

var _parent = MapBase.prototype;

var MapServer = Util.extend(MapBase, {
    // create A* map

    create: function(config) {
        var me = this;

        _parent.create.call(me, config);

        console.log('create A* array with ' + me._width + ' ' + me._height);

        var grid = new gamlib.AStarArray(me._width, me._height);

        // set inaccessible fields
        grid.setValue(0, 0, -1);
    }
});

module.exports = MapServer;