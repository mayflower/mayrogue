define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';

    var Base = Util.extend(Util.Base, {

        validate: function() {
            // Issuer is for bookkeeping only and neither validated nor transmitted across the wire
            return false;
        }

    });

    return Base;
});
