define(['underscore', 'util', 'change'],
    function(_, Util, Change)
{
    "use strict";

    var client = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        properties: [
            'socket',
            'world',
            'generation',
            'actionSource'
        ],
        _generation: null,

        /**
         * Create an instance of the network client
         *
         */
        create: function(config) {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['socket', 'world', 'actionSource']);
        },

        /**
         * Set socket and transfer listeners.
         *
         * @param socket
         */
        setSocket: function(socket) {
            var me = this,
                listeners = {
                    update: me._onIncomingUpdate
                };

            if (me._socket) {
                me._socket.detachListeners(listeners, me);
            }
            me._socket = socket;
            if (me._socket) {
                me._socket.attachListeners(listeners, me);
            }
        },

        _onIncomingUpdate: function(payload) {
            var me = this,
                changeset = _.map(payload.changeset, Change.unserialize),
                stale = (me._generation !== payload.generation),
                world = me.getWorld();

            world.startBatchUpdate();
            _.each(changeset, function(change) {change.apply(world, stale);});
            world.endBatchUpdate();
        },

        setActionSource: function(source) {
            var me = this,
                listeners = {
                    action: me._onAction
                };

            if (me._actionSource) {
                me._actionSource.detachListeners(listeners, me);
            }
            me._actionSource = source;
            if (me._actionSource) {
                me._actionSource.attachListeners(listeners, me);
            }
        },

        _onAction: function(action) {
            var me = this;

            me._socket.emit('action', {
                generation: ++me._generation,
                action: action.serialize()
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