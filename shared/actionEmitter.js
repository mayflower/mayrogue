define(['underscore', 'util', 'action', 'control/types'],
    function(_, Util, Action, ControlTypes)
{
    'use strict';

    //noinspection JSUnusedGlobalSymbols
    var ActionEmitter = Util.extend(Util.Base, {
        properties: ['control'],

        mixins: [Util.Observable],

        _controlQueue: null,
        _timeoutHandle: null,
        _defaultDeadTime: 100,

        create: function(config) {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['control']);
            me._controlQueue = [];
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
                engage: me._onControlEngage,
                disengage: me._onControlDisengage
            }, me);
        },

        _onControlEngage: function(controlType) {
            var me = this;

            if (me._controlQueue.indexOf(controlType) < 0) {
                me._controlQueue.unshift(controlType);
            }
            if (!me._timeoutHandle) {
                me._dispatcher();
            }
        },

        _onControlDisengage: function(controlType) {
            var me = this;

            me._controlQueue = _.without(me._controlQueue, controlType);
        },

        _buildAction: function(controlType) {
            switch(controlType) {
                case ControlTypes.ATTACK:
                    return new Action.Attack();

                case ControlTypes.MOVE_UP:
                    return new Action.Move({deltaY: -1});

                case ControlTypes.MOVE_DOWN:
                    return new Action.Move({deltaY: 1});

                case ControlTypes.MOVE_LEFT:
                    return new Action.Move({deltaX: -1});

                case ControlTypes.MOVE_RIGHT:
                    return new Action.Move({deltaX: 1});
            }

            return null;
        },

        _dispatcher: function() {
            var me = this;

            if (me._controlQueue.length > 0) {
                var action = me._buildAction(me._controlQueue[0]),
                    deadTime = action ? action.getDeadTime() : me._defaultDeadTime;

                if (action) {
                    me.fireEvent('action', action);
                }

                me._timeoutHandle = setTimeout(_.bind(me._dispatcher, me), deadTime);
            } else {
                me._timeoutHandle = null;
            }
        },

        destroy: function() {
            var me = this;

            me._unbindControlListeners();

            Util.Observable.prototype.destroy.apply(me, arguments);
            Util.Base.prototype.destroy.apply(me, arguments);
        },

        busy: function() {
            return (!!this._timeoutHandle);
        }
    });

    return ActionEmitter;
});