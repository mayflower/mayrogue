define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';

    var Base = Util.extend(Util.Base, {

        validate: function() {
            return false;
        }

    });

    return Base;
});
