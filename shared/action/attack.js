define(['underscore', 'util', 'action/types', 'action/base'],
    function(_, Util, Types, Base)
{
    'use strict';

    var Attack = Util.extend(Base, {
        type: Types.ATTACK,

        execute: function(entity, world) {
            var me = this;

            if (!_.isObject(entity)) entity = world.getEntityById(entity);
            if (!entity) return;

            entity.attack();
        },

        validate: function() {
            return true;
        },

        serialize: function() {
            return {};
        }
    });

    Attack.unserialize = function(blob) {
        return new Attack(blob);
    };

    return Attack;
});