// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./shared/util'),
    Tiles = require('./shared/tiles'),
    // For some sick, pervert reason, JSHint complains about "redefining Map"
    // (sic), so we use _Map instead
    _Map = require('./shared/map');

var _parent = _Map.prototype;

var randomMap = Util.extend(_Map, {
    _weights: {
        forest: 1,
        forest1: 1,
        forest2: 1,
        forest3: 1,
        flower_white: 1,
        flower_red: 1,
        stone: 60,
        stone2: 0,
        dirt: 5,
        grass: 70
    },

    create: function(config) {
        var me = this;

        me.getConfig(config, ['height', 'width']);

        if (config.weights)
            me._weights = _.defaults(config.weights, me._weights);
        me._weights = Tiles.compile(me._weights);
        me._normalizeWeights();

        var x, y;
        me._data = [];
        for (x = 0; x < me._width; x++) {
            me._data[x] = [];
            for (y = 0;  y < me._height; y++) {
                me._data[x][y] = me._randomTile();
            }
        }

        for (var i = 0; i < 2; i++) {
            me._smooth();
        }

        _parent.create.call(me, config);
    },

    /**
     * Normalizes all weights so, that the sum is one.
     * The randomness of of a tile beeing of a type is then in reach of Math.random()
     *
     * @private
     */
    _normalizeWeights: function() {
        var me = this;

        var norm = _.reduce(me._weights, function(memo, num) {return  memo + num;}, 0);
        _.each(me._weights, function(weight, tile) {
            me._weights[tile] /= norm;
        });
    },

    /**
     * generate a random tile...
     *
     * @returns {*}
     * @private
     */
    _randomTile: function() {
        var me = this;
        var w = Math.random();

        for (var i = Tiles.MIN_GROUND; i <= Tiles.MAX_GROUND; i++)
            if (w < me._weights[i]) {
                return i;
            } else {
                w -= me._weights[i];
            }

        return null;
    },

    _randomFloor: function() {
        var me = this;
        var tile;
        do {
            tile = me._randomTile();
        } while (tile == Tiles.STONE || tile == Tiles.STONE2)
        return tile;
    },


    /**
     * smooth the generated world
     *
     * @see http://roguebasin.roguelikedevelopment.org/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels
     *
     * @private
     */
    _smooth: function() {
        var // map input
            me = this,
            // map output
            mo = { _data: [] },
            x,
            y;

        for (x = 0; x < me._width; x++) {
            mo._data[x] = [];
            for (y = 0; y < me._height; y++) {
                if (me._isBorder(x, y) ||
                    me._countFloorTilesWithinOneStep(x, y) >= 5 ||
                    me._countFloorTilesWithinTwoSteps(x, y) <= 2) {
                    // change to stone
                    mo._data[x][y] = Tiles.STONE2;
                } else {
                    mo._data[x][y] = me._randomFloor();
                }
            }
        }
        me._data = mo._data;
        // the size of the map etc. doesn't change
    },

    /**
     * check if x,y is a border tile
     *
     * @param x
     * @param y
     * @returns {boolean}
     * @private
     */
    _isBorder: function(x, y) {
         var me = this;

         if (x === 0 || y === 0 || x >= me._width - 1 || y >= me._height - 1) {
               return true;
         } else {
               return false;
         }
    },

    /**
     * count how many tiles around (x,y) are stone tiles (within one step)
     *
     * @param x
     * @param y
     * @returns {number}
     * @private
     */
    _countStoneTilesWithinOneStep: function (x, y) {
        var stoneTileCount = 0,
            me = this;
        var pos_x, pos_y;

        for (pos_x = x - 1; pos_x <= x + 1; pos_x++) {
            for (pos_y = y - 1; pos_y <= y + 1; pos_y++) {
                if (!me._insideMap(pos_x, pos_y)) {
                    continue;
                }

                if (Tiles.STONE == me._data[pos_x][pos_y] ||
                    Tiles.STONE2 == me._data[pos_x][pos_y]) {
                    stoneTileCount++;
                }
            }
        }

        return stoneTileCount;
    },

    /**
     *
     * @param x
     * @param y
     * @returns {number}
     * @private
     */
    _countFloorTilesWithinOneStep: function(x, y) {
        var me = this;
        return 9 - me._countStoneTilesWithinOneStep(x, y);
    },


    /**
     * count how many tiles around (x,y) are stone tiles (within two steps, except the edges)
     *
     * @param x
     * @param y
     * @returns {number}
     * @private
     */
    _countStoneTilesWithinTwoSteps: function(x, y) {
        var stoneTileCount = 0,
            me = this;

        var pos_x, pos_y;

        for (pos_x = x - 2; pos_x <= x + 2; pos_x++) {
            for (pos_y = y - 2; pos_y <= y + 2; pos_y++) {
                if (! me._insideMap(pos_x, pos_y)) {
                    continue;
                }

                // don't count edges
                if (Math.abs(pos_x - x) == 2 && Math.abs(pos_y - y) == 2) {
                    continue;
                }

                if (Tiles.STONE == me._data[pos_x][pos_y] ||
                    Tiles.STONE2 == me._data[pos_x][pos_y]) {
                    stoneTileCount++;
                }
            }
        }
        return stoneTileCount;
    },

    /**
     *
     * @param x
     * @param y
     * @returns {number}
     * @private
     */
    _countFloorTilesWithinTwoSteps: function(x, y) {
        var me = this;
        return 21 - me._countStoneTilesWithinTwoSteps(x, y);
    },

    _insideMap: function(x, y) {
        var me = this;
        if (x < 0 || x >= me._width || y < 0 || y >= me._height) {
            return false;
        }
        return true;
    }


});

module.exports = randomMap;
