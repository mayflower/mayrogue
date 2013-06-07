define(['underscore', 'util', 'command/atom/types', 'command/atom/attack', 'command/atom/move'],
    function(_, Util, Types, Attack, Move)
{
    'use strict';

    var Atom = {
        Attack: Attack,
        Move: Move,

        serialize: function(atom) {
            return {
                type: atom.type,
                data: atom.serialize()
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

    _.extend(Atom, Types);

    return Atom;
});