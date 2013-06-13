define(['underscore', 'util', 'action'],
    function(_, Util, Action)
{
    'use strict';

    var ActionEmitter = Util.extend(Util.Base, {
        properties: ['control'],

        mixins: [Util.Observable],

        create: function(config) {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['control']);
        },

        setControl: function(control) {
            var me = this;

            me._unbindControlListeners();
            me._control = control;
            me._bindControlListeners();
        },

        _unbindControlListeners: function() {
            var me = this;
            if (!me._control) return;

            me._control.detachAllListeners(me);
        },

        _bindControlListeners: function() {
            var me = this;
            if (!me._control) return;

            me._control.attachListeners({
                playerMoveLeft: me._onPlayerMoveLeft,
                playerMoveRight: me._onPlayerMoveRight,
                playerMoveUp: me._onPlayerMoveUp,
                playerMoveDown: me._onPlayerMoveDown,
                playerAttack: me._onPlayerAttack
            }, me);
        },

        _onPlayerMoveLeft: function() {
            this.fireEvent('action', new Action.Move({deltaX: -1}));
        },

        _onPlayerMoveRight: function() {
            this.fireEvent('action', new Action.Move({deltaX: 1}));
        },

        _onPlayerMoveUp: function() {
            this.fireEvent('action', new Action.Move({deltaY: -1}));
        },

        _onPlayerMoveDown: function() {
            this.fireEvent('action', new Action.Move({deltaY: 1}));
        },

        _onPlayerAttack: function() {
            this.fireEvent('action', new Action.Attack());
        },

        destroy: function() {
            var me = this;

            me._unbindControlListeners();

            Util.Observable.prototype.destroy.apply(me, arguments);
            Util.Base.prototype.destroy.apply(me, arguments);
        }
    });

    return ActionEmitter;
});