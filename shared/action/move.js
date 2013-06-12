define(['underscore', 'util', 'action/types', 'action/base'],
    function(_, Util, Types, Base)
{
    'use strict';

    var _parent = Base.prototype;

    var Move = Util.extend(Base, {
        type: Types.MOVE,

        properties: ['deltaX', 'deltaY'],
        _deltaX: 0,
        _deltaY: 0,

        create: function(config) {
            var me = this;
            _parent.create.apply(me, arguments);

            me.getConfig(config, ['deltaX', 'deltaY']);
        },

        execute: function(entity, world) {
            var me = this;

            if (!_.isObject(entity)) entity = world.getEntityById(entity);
            if (!entity) return;

            var bb = entity.getBoundingBox();
            entity.setXY(bb.getX() + me._deltaX, bb.getY() + me._deltaY);
        },

        serialize: function() {
            var me = this;

            return {
                deltaX: me._deltaX,
                deltaY: me._deltaY
            };
        },

        validate: function() {
            var me = this;

            return ((Math.abs(me._deltaX) + Math.abs(me._deltaY)) <= 1);
        }
    });

    Move.unserialize = function(blob) {
        return new Move(blob);
    };

    return Move;
});