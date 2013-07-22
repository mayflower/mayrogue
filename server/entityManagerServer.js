/**
 *  Extends EntityManager with the logic to generate state diffs for publishing
 */

"use strict";

var _ = require('underscore'),
    Util = require('./shared/util'),
    EntityManager = require('./shared/entityManager'),
    Change = require('./shared/change');

var _parent = EntityManager.prototype;

var EntityManagerServer = Util.extend(EntityManager, {

    // Associative arrays for keeping track of state changes
    _movements: null,
    _statsUpdates: null,
    _newEntities: null,

    create: function() {
        var me = this;

        _parent.create.apply(me, arguments);

        me.clearChanges();
    },

    _onEntityMove: function(bbOld, bbNew, entity) {
        var me = this;

        _parent._onEntityMove.apply(me, arguments);

        // Only record the new position if the entity wasn't added in this this timeslice --- in this case, it will
        // be retransmitted anyway
        var id = entity.getId();
        if (!me._newEntities[id]) me._movements[id] = entity;
    },

    _onEntityStatsChange: function(entity) {
        var me = this;

        _parent._onEntityStatsChange.apply(me, arguments);

        // See above
        var id = entity.getId();
        if (!me._newEntities[id]) {
            if (!me._statsUpdates[id]) me._statsUpdates[id] = {id: id};
            me._statsUpdates[id].hp = entity.getStats().getHp();
            me._statsUpdates[id].exp = entity.getStats().getExp();
            me._statsUpdates[id].level = entity.getStats().getLevel();
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

        // Remove the entity from all changeset registries
        var id = entity.getId();
        _.each([me._movements, me._statsUpdates, me._newEntities], function(registry) {
            if (registry[id]) delete registry[id];
        });
    },

    /**
     * Build the changeset for a particular player. The algorithm works by identifying all entities with the
     * current tracking domain and comparing those to the same set from the last timeslice.
     *
     * 1) Entities whose state changes to "not tracked" are removed
     * 2) Entities whose state changes to "tracked" are transmitted
     * 3) Changes for entities which were tracked and are still tracked are transmitted
     * 4) All other entities are ignored.
     *
     * NOTE that the player entity is always in within the tracking domain and thus contained in both sets, so it does not
     * need any special treatment --- changes to the player entity are always transmitted.
     *
     * @param playerContext
     * @returns {Array}
     */
    pickupChangeset: function(playerContext) {
        var me = this,
            trackedEntitiesOld = playerContext.getTrackedEntities();

        // Entities within this domain are tracked
        var trackingDomain = playerContext.getTrackingDomain();

        // Build a list of all entities which are in the tracking domain
        var trackedEntitiesNew = {};
        _.each(me.getEntities(), function(entity) {
            if (trackingDomain.intersect(entity.getBoundingBox()))
                trackedEntitiesNew[entity.getId()] = entity;
        });

        var changeset = [];

        _.each(trackedEntitiesOld, function(entity) {
            // We _could_ use the field id here, but then we'd have to typecast!!!
            var id = entity.getId();

            // If we were are still tracking a previously tracked entity, just parrot the changes
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

                // The entity is not tracked anymore -> remove it
                changeset.push(new Change.RemoveEntity({
                    id: id
                }));
            }
        });

        _.each(trackedEntitiesNew, function(entity) {
            // We _could_ use the field id here, but then we'd have to typecast!!!
            var id = entity.getId();

            // To-be-tracked entities which were not tracked before are transmitted
            if (!trackedEntitiesOld[id]) {
                changeset.push(new Change.AddEntity({
                    entity: entity
                }));
            }
        });

        // Cycle the tracked entities for the next step
        playerContext.setTrackedEntities(trackedEntitiesNew);

        return changeset;
    },

    /**
     * Clear all changes
     */
    clearChanges: function() {
        var me = this;

        me._movements = {};
        me._statsUpdates = {};
        me._newEntities = {};
    }

});

module.exports = EntityManagerServer;