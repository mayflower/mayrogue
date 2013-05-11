define(['underscore', 'util', 'fastclick'],
    function(_, Util, FastClick)
{
    "use strict";

    var touchControls = Util.extend(Util.Base, {

        mixins: [Util.Observable],
        properties: [
            'el'
        ],

        /**
         * constructor
         */
        create: function() {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me._el = document.getElementById('player_control');
            new FastClick(me._el);
            me._createMovementControls();
            me._createAttackControl();
        },

        _createAttackControl: function() {
            var me = this;
            var canvas = document.getElementById('stage');

            new FastClick(canvas);
            canvas.onclick = function() {
                me.fireEvent("playerAttack");
            }
        },

        /**
         * Create the controls for movement
         *
         */
        _createMovementControls: function() {
            var me = this;

            _.each({
                up: {
                    type: 'move',
                    func: function() {
                        me.fireEvent("playerMoveUp");
                    }
                },
                left: {
                    type: 'move',
                    func: function() {
                        me.fireEvent("playerMoveLeft");
                    }
                },
                right: {
                    type: 'move',
                    func: function() {
                        me.fireEvent("playerMoveRight");
                    }
                },
                down: {
                    type: 'move',
                    func: function() {
                        me.fireEvent("playerMoveDown");
                    }
                }
            }, function(ctrl, id) {
                var control = document.createElement("input");
                control.id = id;

                control.className += ' btn ' + ctrl.type;
                control.type = "button";
                control.value = id;
                control.style.visibility = 'visible';
                control.onclick = ctrl.func;

                me._el.appendChild(control);
            });

            //show the new buttons
            me._el.style.visibility = "visibility";
        }
    });

    return touchControls;
});