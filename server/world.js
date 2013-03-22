// vim: set softtabstop=4

"use strict";

var requirejs = require('requirejs'),
    _ = require('underscore'),
    Util = require('./util'),
    WorldBase  = require('./worldBase');

var World = Util.extend(WorldBase, {

    _changeset: null,

    create: function() {
        var me = this;

        WorldBase.prototype.create.apply(me, arguments);
        me._changeset = [];
    },

    _onEntityChange: function(entity) {
        var me = this;

        WorldBase.prototype._onEntityChange.apply(me, arguments);
        me._changeset.push({
            id: entity.getId(),
            x: entity.getX(),
            y: entity.getY()
        });
    },

    pickupChangeset: function() {
        var me = this;

        var changeset = me._changeset;
        me._changeset = [];
        return changeset;
    }

});

module.exports = World;
