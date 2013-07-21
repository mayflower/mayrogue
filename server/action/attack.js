'use strict';

var _ =                 require('underscore'),
    Util =              require('../shared/util'),
    ActionShared =      require('../shared/action');

var Attack = Util.extend(ActionShared.Attack, {

        execute: function(entity, world) {
            if (!_.isObject(entity)) entity = world.getEntityById(entity);
            if (!entity) return;

            world.executeAttack(entity);
        }

});

Attack.unserialize = function(blob) {
    return new Attack(blob);
};

module.exports = Attack;
