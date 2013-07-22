'use strict';

var _ = require('underscore'),
    RandomWalk =        require('./strategy/randomWalk'),
    Hunt =              require('./strategy/hunt'),
    Types =             require('./strategy/types');

var Strategy = {
    RandomWalk: RandomWalk,
    Hunt: Hunt
};

_.extend(Strategy, Types);

module.exports = Strategy;
