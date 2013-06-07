define(['underscore', 'util', 'command/atom/types', 'command/atom/base'],
    function(_, Util, Types, Base)
    {
        'use strict';

        var Move = Util.extend(Base, {
            type: Types.MOVE,

            serialize: function() {
                return {};
            }
        });

        Move.unserialize = function(blob) {
            return new Move(blob);
        };

        return Move;
    });
