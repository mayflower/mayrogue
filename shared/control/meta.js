define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';

    var Meta = Util.extend(Util.Base, {
        _registry: null,
        _controlEvents: ['playerMoveLeft', 'playerMoveRight', 'playerMoveUp', 'playerMoveDown',
            'playerAttack'],

        mixins: [Util.Observable],

        _createEventProxy: function(event) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0);

                args.unshift(event);
                this.fireEvent.apply(this, args);
            };
        },

        create: function() {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me._registry = [];
        },

        addControl: function(control) {
            var me = this;

            me._registry.push(control);

            var listeners = {};
            _.each(me._controlEvents, function(event) {
                listeners[event] = me._createEventProxy(event);
            });

            control.attachListeners(listeners, me);
        },

        removeControl: function(control) {
            var me = this;

            me._registry = _.without(me._registry, control);
            control.detachAllListeners(me);
        },

        destroy: function() {
            var me = this;

            _.each(me._registry, function(control) {
                control.detachAllListeners(me);
            });

            me._registry = [];

            Util.Base.prototype.destroy.apply(me, arguments);
            Util.Observable.prototype.destroy.apply(me, arguments);
        }
    });

    return Meta;
});