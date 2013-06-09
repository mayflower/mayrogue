define(['underscore', 'util', 'action/types', 'action/base'],
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