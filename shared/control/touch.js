define(['underscore', 'util', 'fastclick'],
    function(_, Util, FastClick)
{
    "use strict";

    var touchControls = Util.extend(Util.Base, {

        mixins: [Util.Observable],
        properties: [
            'controlElement',
            'canvasElement'
        ],

        /**
         * constructor
         */
        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['controlElement', 'canvasElement']);

            //noinspection JSHint
            new FastClick(me._controlElement);

            me._createMovementControls();
            me._createAttackControl();
        },

        _createAttackControl: function() {
            var me = this;

            //noinspection JSHint
            new FastClick(me._canvasElement);
            me._canvasElement.onclick = function() {
                me.fireEvent("playerAttack");
            };
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

                me._controlElement.appendChild(control);
            });

            //show the new buttons
            me._controlElement.style.visibility = "visibility";
        }
    });

    return touchControls;
});