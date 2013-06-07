define(['underscore', 'util', 'command/atom/types', 'command/atom/base'],
    function(_, Util, Types, Base)
{
    'use strict';

    var Attack = Util.extend(Base, {
        type: Types.ATTACK,

        serialize: function() {
            return {};
        }
    });

    Attack.unserialize = function(blob) {
        return new Attack(blob);
    };

    return Attack;
});