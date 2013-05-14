"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    EntityManager = require('./client/entityManager'),
    Change = require('./client/change');

var _parent = EntityManager.prototype;

var EntityManagerServer = Util.extend(EntityManager, {

    _movements: null,
    _statsUpdates: null,
    _newEntities: null,

    create: function(config) {
        var me = this;

        _parent.create.apply(me, arguments);

        me.clearChanges();
    },

    _onEntityMove: function(entity) {
        var me = this;

        _parent._onEntityMove.apply(me, arguments);

        var id = entity.getId();
        if (!me._newEntities[id]) me._movements[id] = entity;
    },

    _onEntityStatsChange: function(entity) {
        var me = this;

        _parent._onEntityStatsChange.apply(me, arguments);

        var id = entity.getId();
        if (!me._newEntities[id]) {
            if (!me._statsUpdates[id]) me._statsUpdates[id] = {id: id};
            me._statsUpdates[id].hp = entity.getStats().getHp();
        }
    },


    addEntity: function(entity) {
        var me = this,
            id = entity.getId();

        if (me.getEntityById(id)) return;

        _parent.addEntity.apply(me, arguments);

        me._newEntities[id] = entity;
    },


    removeEntity: function(entity) {
        var me = this;

        _parent.removeEntity.apply(me, arguments);

        var id = entity.getId();
        _.each([me._movements, me._statsUpdates, me._newEntities], function(registry) {
            if (registry[id]) delete registry[id];
        });
    },

    pickupChangeset: function(playerContext) {
        var me = this,
            trackedEntitiesOld = playerContext.getTrackedEntities();

        var relevanceDomain = playerContext.getRelevanceDomain();

        var trackedEntitiesNew = {};
        _.each(me.getEntities(), function(entity) {
            if (relevanceDomain.intersect(entity.getBoundingBox()))
                trackedEntitiesNew[entity.getId()] = entity;
        });

        var changeset = [];

        _.each(trackedEntitiesOld, function(entity) {
            // We _could_ use the field id here, but then we'd have to typecast!!!
            var id = entity.getId();

            if (trackedEntitiesNew[id]) {

                if (me._movements[id]) {
                    changeset.push(new Change.Movement({
                        id: id,
                        x: entity.getX(),
                        y: entity.getY(),
                        heading: entity.getHeading()
                    }));
                }

                if (me._statsUpdates[id]) {
                    changeset.push(new Change.Stats(me._statsUpdates[id]));
                }
            } else {

                changeset.push(new Change.RemoveEntity({
                    id: id
                }));
            }
        });

        _.each(trackedEntitiesNew, function(entity) {
            // We _could_ use the field id here, but then we'd have to typecast!!!
            var id = entity.getId();

            if (!trackedEntitiesOld[id]) {
                changeset.push(new Change.AddEntity({
                    entity: entity
                }));
            }
        });

        playerContext.setTrackedEntities(trackedEntitiesNew);

        return changeset;
    },

    clearChanges: function() {
        var me = this;

        me._movements = {};
        me._statsUpdates = {};
        me._newEntities = {};
    }

});

module.exports = EntityManagerServer;