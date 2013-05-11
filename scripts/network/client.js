define(['util', 'change'],
    function(Util, Change)
{
    "use strict";

    var client = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        properties: [
            'socket',
            'world',
            'player',
            'generation'
        ],

        /**
         * return the current _player
         *
         * @returns {object}
         */
        getPlayer: function() {
            var me = this;
            return me._player;
        },

        /**
         * return the current world
         *
         * @returns {object}
         */
        getWorld: function() {
            var me = this;
            return me._world;
        },

        /**
         * Create an instance of the network client
         *
         * @param {object} socket an instance of _socket.io
         * @param {object} world an instance of the current world
         * @param {object} player an instance of the current _player
         */
        create: function(socket, world, player) {
            var me = this;
            me._socket = socket;
            me._world = world;
            me._player = player;
            me._generation = 0;

            me._addSocketUpdateHandle();

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
        },

        /**
         * Send a _player move request to the server
         *
         * @param {int} dx
         * @param {int} dy
         */
        broadcastMovement: function(dx, dy) {
            var me = this;
            me._socket.emit('movement', {
                generation: ++me._generation,
                delta: {x: dx, y: dy}
            });
        },

        /**
         * Send an attack request to the server
         */
        broadcastAttack: function() {
            var me = this;
            me._socket.emit('attack', {
                generation: ++me._generation,
                attacker: me._player.getId()
            });
        },

        /**
         * Add handle to react on _socket update response
         *
         * @private
         */
        _addSocketUpdateHandle: function() {
            var me = this, world = me._world;
            me._socket.on('update', function(payload) {
                var changeset = _.map(payload.changeset, Change.unserialize);
                var stale = (me._generation !== payload.generation);

                world.startBatchUpdate();
                _.each(changeset, function(change) {change.apply(world, stale);});
                world.endBatchUpdate();
            });
        },

        /**
         * Log in the user with a username
         *
         * @param {string} username
         */
        login: function(username) {
            var me = this;
            me._socket.emit('login', {'username': username});
            me._socket.on('reconnect', me.login(username));
        },

        /**
         * Reconnect the user with the given name
         *
         * @param {string} username
         */
        reconnect: function(username) {
            var me = this;
            me.login(username);
        }
    });

    return client;
});