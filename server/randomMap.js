// vim:softtabstop=4:shiftwidth=4

"use strict";

var _ = require('underscore'),
    Util = require('./util'),
    Map = require('./map'),
    Tiles = require('./tiles');

module.exports = Util.extend(Map, {
    _weights: {
        forest: 0.1,
        forest1: 0.1,
        forest2: 0.1,
        forest3: 0.1,
        flower_white: 0.1,
        flower_red: 0.1,
        stone: 0.5,
        dirt: 0.7,
        grass: 1.9
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
    },

     /**
      * smooth the generated world
      *
      * @see http://roguebasin.roguelikedevelopment.org/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels
      *
      * @private
      */
    _smooth: function() {
        var me = this,
            x,
            y;

        for (x = 0; x < me._width; x++) {
            for (y = 0; y < me._height; y++) {
                 if (me._isBorder(x, y) || me._countStoneTilesWithinOneStep(x, y) >= 5) {
                     // change to stone
                     me._data[x][y] = Tiles.STONE;
                 }
             }
         }
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

          if (x == 0 || y == 0 || x >= me._width - 1 || y >= me._height - 1) {
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
    _countStoneTilesWithinOneStep: function(x, y) {
         var offsets = [-1, 0, 1],
              i,
              j,
              stoneTileCount = 0,
              me = this;

         var pos_x, pos_y;

         for (i = 0; i < offsets.length; i++) {
              for (j = 0; j < offsets.length; j++) {

                    pos_x = x + offsets[i];
                    pos_y = y + offsets[j];

                    if (me._data[pos_x] && Tiles.STONE == me._data[pos_x][pos_y]) {
                         stoneTileCount++;
                    }
              }
         }

         return stoneTileCount;
    },

    _normalizeWeights: function() {
        var me = this;

        var norm = _.reduce(me._weights, function(x, y) {return  x + y;}, 0);
        _.each(me._weights, function(weight, tile) {
            me._weights[tile] /= norm;
        });
    },

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
    }
});

