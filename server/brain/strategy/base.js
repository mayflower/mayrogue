'use strict';

var _ =         require('underscore'),
    Util =      require('../../shared/util'),
    Types =     require('./types');

var Base = Util.extend(Util.Base, {
    properties: [
        {field: '_entity', getter: true}
    ],

    type: Types.UNDEFINED,

    create: function(config) {
        var me = this;

        me.getConfig(config, ['entity']);
    }
});

module.exports = Base;
