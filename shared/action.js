define(['underscore', 'util', 'action/types', 'action/attack', 'action/move'],
    function(_, Util, Types, Attack, Move)
{
    'use strict';

    var Action = {
        Attack: Attack,
        Move: Move,

        serialize: function(action) {
            return {
                type: action.type,
                data: action.serialize()
            };
        },

        unserialize: function(blob) {
            switch (blob.type) {
                case Types.ATTACK:
                    return Attack.unserialize(blob);
                case Types.MOVE:
                    return Move.unserialize(blob);
                default:
                    return null;
            }
        }
    };

    _.extend(Action, Types);

    return Action;
});