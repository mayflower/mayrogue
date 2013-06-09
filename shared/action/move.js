define(['underscore', 'util', 'action/types', 'action/base'],
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