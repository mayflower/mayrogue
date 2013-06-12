define(['underscore', 'util', 'change', 'socket.io'],
    function(_, Util, Change, Io)
{
    "use strict";

    var client = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        properties: [
            'world',
            'generation',
            'actionSource',
            {field: '_socket', getter: true}
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

            me.getConfig(config, ['world', 'actionSource']);

            me._socket = Io.connect();
            me._socket.on('welcome', me._onWelcome);
            me._socket.on('update', me._onIncomingUpdate);
        },

        _onWelcome: function(payload) {
            var me = this;

            me.fireEvent('welcome', payload);
        },

        _onIncomingUpdate: function(payload) {
            var me = this,
                changeset = _.map(payload.changeset, Change.unserialize),
                stale = (me._generation !== payload.generation),
                world = me.getWorld();

            if (!world) return;

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
        }
    });

    return client;
});