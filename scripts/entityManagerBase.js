define(['underscore', 'util', 'geometry'],
    function(_, Util, Geometry)
{
    "use strict";

    var viewportWidth = 20,
        viewportHeight = 15;

    var positive = function(x) {return x > 0 ? x : 0;};

    var EntityManagerBase = Util.extend(Util.Base, {
        properties: [
            {field: '_entities', getter: true}
        ],

        mixins: [Util.Observable],

        _entityMap: null,

        create: function(config) {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me._entities = [];
            me._entityMap = {};
        },

        addEntity: function(entity) {
            var me = this;

            if (me._entityMap[entity.getId()]) return;

            me._entities.push(entity);
            me._entityMap[entity.getId()] = entity;

            entity.attachListeners({
                move: me._onEntityMove,
                attack: me._onEntityAttack,
                statsChange: me._onEntityStatsChange
            }, me);

            me.fireEvent('entityAdded', entity);
        },

        _proxyEvent: function(event, eventArguments) {
            var me = this;

            var args = Array.prototype.slice.call(eventArguments, 0);
            args.unshift(event);

            me.fireEvent.apply(me, args);
        },

        _onEntityMove: function() {
            this._proxyEvent('move', arguments);
        },

        _onEntityAttack: function() {
            this._proxyEvent('attack', arguments);
        },

        _onEntityStatsChange: function() {
            this._proxyEvent('statsChange', arguments);
        },

        removeEntity: function(entity) {
            var me = this;

            me._entities = _.without(me._entities, entity);
            delete me._entityMap[entity.getId()];

            entity.destroy();

            me.fireEvent('entityRemoved');
        },

        getEntityById: function(id) {
            var me = this;

            return me._entityMap[id] ? me._entityMap[id] : null;
        },

        rectAccessible: function(rect, entity) {
            var me = this;

            if (!entity) return true;
            return !_.some(me._entities, function(e) {
                return (e !== entity &&
                    e.getBoundingBox().intersect(rect));
            });
        },

        fieldAccessible: function(x, y, entity) {
            var me = this;

            if (!entity) return true;
            return !_.some(me._entities, function(e) {
                return (e !== entity &&
                    e.getBoundingBox().isInside(x, y));
            });
        },

        entitiesIntersectingWith: function(rect) {
            var me = this;

            return _.filter(me._entities, function(e) {
                return rect.intersect(e.getBoundingBox());
            });
        },

        destroy: function() {
            var me = this;

            Util.Base.prototype.destroy.apply(me, arguments);
            Util.Observable.prototype.destroy.apply(me, arguments);
        },

        _getDomain: function(origin, factor) {
            return new Geometry.Rectangle({
                x: positive(origin.getX() - Math.floor(viewportWidth * factor / 2)),
                y: positive(origin.getY() - Math.floor(viewportHeight * factor / 2)),
                width: Math.ceil(viewportWidth * factor),
                height: Math.ceil(viewportHeight * factor)
            });
        },

        _getRelevanceDomain: function(origin) {
            return this._getDomain(origin, 1.5);
        }
    });

    return EntityManagerBase;
});