define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';

    var _parent = Util.Base.prototype;

    var Base = Util.extend(Util.Base, {
        properties: ['world'],

        create: function(config) {
            var me = this;
            _parent.create.apply(me, arguments);

            me.getConfig(config, ['world']);
        },

        setWorld: function(world) {
            var me = this,
                listeners = {
                    visibleChange: me.redraw
                };

            if (me._world) {
                me._world.detachListeners(listeners, me);
            }
            me._world = world;
            if (me._world) {
                me._world.attachListeners(listeners, me);
                me.redraw();
            }
        },

        redraw: function() {},

        destroy: function() {
            var me = this;

            me.setWorld(null);

            _parent.destroy.apply(me, arguments);
        }
    });

    return Base;
});