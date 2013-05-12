// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'entityManager'],
    function(_, Util, EntityManager) {

    "use strict";

    var WorldBase = Util.extend(Util.Base, {
        properties: [
            {field: '_map', getter: true},
            {field: '_entities', getter: true},
            {field: '_batchInProgress', getter: 'batchInProgress'}
        ],
        mixins: [Util.Observable],

        _dirty: false,
        _entityManager: null,

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['map', 'entityManager']);

            if (!me._entityManager) {
                me._entityManager = new EntityManager();
            }

            me._entityManager.attachListeners({
                move: me._onEntityMove,
                attack: me._onEntityAttack,
                statsChange: me._onEntityStatsChange
            }, me);

            if (config.entities) _.each(config.entities, function(entity) {
                me.addEntity(entity);
            });
        },

        addEntity: function(entity) {
            var me = this;

            me._entityManager.addEntity(entity);
            entity.setWorld(me);
        },

        removeEntity: function(entity) {
            var me = this;

            entity.setWorld(null);
            me._entityManager.removeEntity(entity);
        },

        _onEntityMove: function() {
            var me = this;

            me.fireEvent('change');
        },

        _onEntityStatsChange: function() {
            var me = this;

            me.fireEvent('change');
        },

        _onEntityAttack: function()
        {
        },

        getMapData: function() {
            var me = this;

            return me._map.getData();
        },

        destroy: function() {
            var me = this;

            me._entityManager.destroy();
            Util.Observable.prototype.destroy.apply(me, arguments);
            Util.Base.prototype.destroy.apply(me, arguments);
        },

        rectAccessible: function(rect, entity) {
            var me = this;

            if (!me._map.rectAccessible(rect)) return false;
            return me._entityManager.rectAccessible(rect, entity);
        },

        fieldAccessible: function(x, y, entity) {
            var me = this;

            if (!me._map.fieldAccessible(x, y)) return false;
            return me._entityManager.fieldAccessible(x, y, entity);
        },

        entitiesIntersectingWith: function(entity) {
            var me = this;

            return me._entityManager.entitiesIntersectingWith(entity);
        },

        getEntityById: function(id) {
            var me = this;

            return me._entityManager.getEntityById(id);
        },

        getEntities: function() {
            var me = this;

            return me._entityManager.getEntities();
        }
    });

    return WorldBase;

});
