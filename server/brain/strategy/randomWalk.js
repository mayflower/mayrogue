'use strict';

var _ =         require('underscore'),
    Util =      require('../../shared/util'),
    Base =      require('./base'),
    Action =    require('../../action'),
    Types =     require('./types');

var _parent = Base.prototype;

var RandomWalk = Util.extend(Base, {
    properties: ['walkPropability'],

    type: Types.RANDOM_WALK,

    _walkPropability: 0.3,

    create: function(config) {
        var me = this;

        me.getConfig(config, ['walkPropability']);

        _parent.create.apply(me, arguments);
    },

    decide: function() {
        var me = this;

        if (Math.random() > me._walkPropability) {
            return null;
        }

        switch (_.random(3)) {
            case 0:
                return new Action.Move({deltaX: 1});
            case 1:
                return new Action.Move({deltaX: -1});
            case 2:
                return new Action.Move({deltaY: 1});
            case 3:
                return new Action.Move({deltaY: -1});
        }

        return null;
    }
});

module.exports = RandomWalk;