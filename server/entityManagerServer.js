"use strict";

var _ = require('underscore'),
    Util = require('./client/util'),
    EntityManager = require('./client/entityManager');

var EntityManagerServer = Util.extend(EntityManager, {

});

module.exports = EntityManagerServer;