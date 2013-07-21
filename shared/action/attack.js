define(['underscore', 'util', 'action/types', 'action/base'],
    function(_, Util, Types, Base)
{
    'use strict';

    var Attack = Util.extend(Base, {
        type: Types.ATTACK,

        execute: function() {
            // The actual implementation uses server side code and is located on the server side.
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