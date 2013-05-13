"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    EntityManager = require('./client/entityManager'),
    Change = require('./client/change');

var _parent = EntityManager.prototype;

var EntityManagerServer = Util.extend(EntityManager, {

    _movements: null,
    _statsUpdates: null,

    create: function(config) {
        var me = this;

        _parent.create.apply(me, arguments);

        me._movements = {};
        me._statsUpdates = {};
    },

    _onEntityMove: function(entity, bbOld, bbNew) {
        var me = this;

        _parent._onEntityMove.apply(me, arguments);

        var id = entity.getId();
        if (!me._movements[id]) me._movements[id] = {old: bbOld};
    },

    _onEntityStatsChange: function(entity) {
        var me = this;

        _parent._onEntityStatsChange.apply(me, arguments);

        var id = entity.getId();
        me._statsUpdates[id] = ['hp'];
    },

    getChangesetForEntity: function() {
        var me = this;

        var changeset = [];

        _.each(me._movements, function(movement, id) {
            var entity = me.getEntityById(id);
            changeset.push(new Change.Movement({
                id: id,
                x: entity.getX(),
                y: entity.getY(),
                heading: entity.getHeading()
            }));
        });

        _.each(me._statsUpdates, function(update, id) {
            var entity = me.getEntityById(id);
            changeset.push(new Change.Stats({
                id: entity.getId(),
                hp: entity.getStats().getHp()
            }));
        });

        me._movements = {};
        me._statsUpdates = {};

        return changeset;
    }

});

module.exports = EntityManagerServer;