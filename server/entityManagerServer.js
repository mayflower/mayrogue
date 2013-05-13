"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    EntityManagerBase = require('./client/entityManagerBase'),
    Change = require('./client/change'),
    Geometry = require('./client/geometry');

var _parent = EntityManagerBase.prototype;

var EntityManagerServer = Util.extend(EntityManagerBase, {

    _movements: null,
    _statsUpdates: null,
    _newEntities: null,
    _removedEntities: null,

    create: function(config) {
        var me = this;

        _parent.create.apply(me, arguments);

        me.clearChanges();
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

    pickupChangeset: function(playerContext) {
        var me = this;

        var player = playerContext.getEntity(),
            playerId = player.getId(),
            changeset = [];

        var relevanceDomainNew = me._getRelevanceDomain(player);

        var relevanceDomainOld = me._movements[playerId] ?
            me._getRelevanceDomain(me._movements[playerId].old) : relevanceDomainNew;

        _.each(me.getEntities(), function(entity) {
            var id = entity.getId();

            var bbNew = entity.getBoundingBox(),
                bbOld = me._movements[id] ? me._movements[id].old : bbNew;

            var isRelevant = bbNew.intersect(relevanceDomainNew),
                wasRelevant = bbOld.intersect(relevanceDomainOld);

            if (!wasRelevant && isRelevant && !me._newEntites[id]) {
                changeset.push(new Change.AddEntity({
                    entity: entity
                }));
            }
            if (wasRelevant && !isRelevant && !me._newEntities[id]) {
                changeset.push(new Change.RemoveEntity({
                    id: entity.getId()
                }));
            }
            if (wasRelevant && isRelevant && !me._newEntities[id]) {
                if (me._movements[id]) {
                    changeset.push(new Change.Movement({
                        id: id,
                        x: entity.getX(),
                        y: entity.getY(),
                        heading: entity.getHeading()
                    }));
                }
                if (me._statsUpdates[id]) {
                    changeset.push(new Change.Stats({
                        id: entity.getId(),
                        hp: entity.getStats().getHp()
                    }));
                }
            }
            if (me._newEntities[id] && isRelevant) {
                changeset.push(new Change.AddEntity({
                    entity: entity
                }));
            }
        });

        _.each(me._removedEntites, function(entity, id) {
            changeset.push(new Change.RemoveEntity)
        });

        me.clearChanges();

        return changeset;
    },

    clearChanges: function() {
        var me = this;

        me._movements = {};
        me._statsUpdates = {};
        me._removedEntites = {};
        me._newEntites = {};
    }

});

module.exports = EntityManagerServer;