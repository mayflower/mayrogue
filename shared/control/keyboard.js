define(['underscore', 'util', 'mousetrap', 'control/types'],
    function(_, Util, Mousetrap, ControlTypes)
{
    "use strict";

    var keyboardControls = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        _keyMap: {
            left:   ControlTypes.MOVE_LEFT,
            right:  ControlTypes.MOVE_RIGHT,
            up:     ControlTypes.MOVE_UP,
            down:   ControlTypes.MOVE_DOWN,
            'a':    ControlTypes.ATTACK
        },

        _engaged: null,

        /**
         * constructor
         */
        create: function() {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me._engaged = {};

            _.each(me._keyMap, function(controlType, key) {
                me._registerBinding(key, controlType);
            });
        },

        _registerBinding: function(key, controlType) {
            var me = this;

            Mousetrap.bind(key, function(){
                if (!me._engaged[controlType]) me.fireEvent('engage', controlType);
                me._engaged[controlType] = true;
            }, 'keydown');

            Mousetrap.bind(key, function(){
                me.fireEvent('disengage', controlType);
                me._engaged[controlType] = false;
            },'keyup');
        }
    });

    return keyboardControls;
});