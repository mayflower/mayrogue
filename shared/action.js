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
            var me = this;

            switch (blob.type) {
                case (Types.ATTACK):
                    return me.Attack.unserialize(blob.data);
                case (Types.MOVE):
                    return me.Move.unserialize(blob.data);
                default:
                    return null;
            }
        }
    };

    _.extend(Action, Types);

    return Action;
});
