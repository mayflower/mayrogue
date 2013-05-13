"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    EntityManager = require('./client/entityManager'),
    Change = require('./client/change');

var _parent = EntityManager.prototype;

var EntityManagerServer = Util.extend(EntityManager, {

    _changeset: null,

    create: function(config) {
        var me = this;

        _parent.create.apply(me, arguments);

        me._changeset = [];
    },

    _onEntityMove: function(entity, bbOld, bbNew) {
        var me = this;

        _parent._onEntityMove.apply(me, arguments);

        if (me._changeset) {
            me._changeset.push(new Change.Movement({
                id: entity.getId(),
                x: entity.getX(),
                y: entity.getY(),
                heading: entity.getHeading()
            }));
        }
    },

    _onEntityStatsChange: function(entity) {
        var me = this;

        _parent._onEntityStatsChange.apply(me, arguments);

        if (me._changeset) {
            me._changeset.push(new Change.Stats({
                id: entity.getId(),
                hp: entity.getStats().getHp()
            }));
        }
    },

    getChangesetForEntity: function() {
        var me = this;

        var changeset = me._changeset;
        me._changeset = [];

        return changeset;
    }

});

module.exports = EntityManagerServer;