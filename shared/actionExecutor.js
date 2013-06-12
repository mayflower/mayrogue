define(['underscore', 'util', 'action'],
    function(_, Util, Action)
{
   'use strict';

    var _parent = Util.Base.prototype;

    var ActionExecutor = Util.extend(Util.Base, {
        properties: ['source', 'world'],

        create: function(config) {
            var me = this;

            _parent.create.apply(me, arguments);
            me.getConfig(config, ['world', 'source']);
        },

        setSource: function(source) {
            var me = this,
                listeners = {
                    action: me._onAction
                };

            if (me._source) {
                me._source.detachListeners(listeners, me);
            }
            me._source = source;
            if (me._source) {
                me._source.attachListeners(listeners, me);
            }
        },

        _onAction: function(action) {
            var me = this;

            if (!me._world) return;

            switch (action.type) {
                case Action.ATTACK:
                    action.execute(me._world.getPlayer(), me._world);
                    break;
            }
        },

        destroy: function() {
            var me = this;

            me.setSource(null);

            _parent.destroy.apply(me, arguments);
        }
    });

    return ActionExecutor;
});