define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';

    var Base = Util.extend(Util.Base, {

        properties: [
            {field: '_deadTime', getter: true}
        ],

        _deadTime: 150,

        validate: function() {
            return false;
        }

    });

    return Base;
});
