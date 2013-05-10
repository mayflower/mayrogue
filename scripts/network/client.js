define(['util', 'change'],
    function(Util, Change)
{
    "use strict";

    var client = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        Socket: null,
        World: null,
        Player: null,
        generation: 0,

        /**
         * return the current player
         *
         * @returns {object}
         */
        getPlayer: function() {
            var me = this;
            return me.Player;
        },

        /**
         * return the current world
         *
         * @returns {object}
         */
        getWorld: function() {
            var me = this;
            return me.World;
        },

        /**
         * Create an instance of the network client
         *
         * @param {object} socket an instance of socket.io
         * @param {object} world an instance of the current world
         * @param {object} player an instance of the current player
         */
        create: function(socket, world, player) {
            var me = this;
            me.Socket = socket;
            me.World = world;
            me.Player = player;

            me._addSocketUpdateHandle();

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
        },

        /**
         * Send a player move request to the server
         *
         * @param {int} dx
         * @param {int} dy
         */
        broadcastMovement: function(dx, dy) {
            var me = this;
            me.Socket.emit('movement', {
                generation: ++me.generation,
                delta: {x: dx, y: dy}
            });
        },

        /**
         * Send an attack request to the server
         */
        broadcastAttack: function() {
            var me = this;
            me.Socket.emit('attack', {
                generation: ++me.generation,
                attacker: me.Player.getId()
            });
        },

        /**
         * Add handle to react on socket update response
         *
         * @private
         */
        _addSocketUpdateHandle: function() {
            var me = this, world = me.World;
            me.Socket.on('update', function(payload) {
                var changeset = _.map(payload.changeset, Change.unserialize);
                var stale = (me.generation !== payload.generation);

                world.startBatchUpdate();
                _.each(changeset, function(change) {change.apply(world, stale);});
                world.endBatchUpdate();
            });
        }

    });

    return client;
});