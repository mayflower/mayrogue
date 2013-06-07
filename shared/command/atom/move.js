define(['underscore', 'util', 'command/atom/types', 'command/atom/base'],
    function(_, Util, Types, Base)
{
    'use strict';

    var Move = Util.extend(Base, {
        type: Types.MOVE,

        properties: ['deltaX', 'deltaY'],

        create: function(config) {
            var me = this;

            me.getConfig(config, ['deltaX', 'deltaY']);
        },

        serialize: function() {
            return {
                deltaX: me._deltaX,
                deltaY: me._deltaY
            };
        },

        validate: function() {
            return ((Math.abs(me._deltaX) + Math.abs(me._deltaY)) <= 1);
        }
    });

    Move.unserialize = function(blob) {
        return new Move(blob);
    };

    return Move;
});