'use strict';

var Util =              require('./shared/util'),
    ActionShared =      require('./shared/action'),
    Attack =            require('./action/attack');

var Action = Util.objectCreate(ActionShared);

Action.Attack = Attack;

module.exports = Action;
