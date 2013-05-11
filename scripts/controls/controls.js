/**
 * Object to abstract the movement/attack controlhandling, by mapping the specific device controls to
 * some movement events.
 * This events are:
 * <ul>
 *     <li>playerMoveLeft</li>
 *     <li>playerMoveRight</li>
 *     <li>playerMoveUp</li>
 *     <li>playerMoveDown</li>
 *     <li>playerAttack</li>
 * </ul>
 * each control mapper should throw this events, like the keyboard controller.
 * E.g.: <code>
 *     this.fireEvent("playerMoveLeft");
 * </code>
 */
define(['util', 'controls/keyboard', 'controls/touch'],
    function(Util, Keyboard, Touch)
{
    "use strict";

    var controls = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        /**
         * Holds the control handler, e.g.: Keyboard or touch
         */
        ControlHandler: null,

        /**
         * Stores the communication socket, to send attack/movement requests to the server
         * @todo should be encapsulated in a client/network class
         */
        Client: null,

        /**
         * The player which is controlled
         */
        Player: null,

        /**
         * Creates an control object, which handles the movement/attack events and instanciate the right controls for
         * the device on which the game is played
         *
         * @param {object} client
         */
        create: function(client) {
            var me = this;
            me.Client = client;
            me.Player = me.Client.getPlayer();

            if(me.isTouch()) {
                me.ControlHandler = new Touch();
            } else {
                me.ControlHandler = new Keyboard();
            }

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.createMovementListeners();
        },

        /**
         * Create all the movement handlers on the control handler
         */
        createMovementListeners: function() {
            var me = this;
            me.ControlHandler.attachListeners({
                playerMoveLeft: function() {
                    me.Player.setX(me.Player.getX() - 1);
                    me.Client.broadcastMovement(-1, 0);
                },
                playerMoveRight: function() {
                    me.Player.setX(me.Player.getX() + 1);
                    me.Client.broadcastMovement(1, 0);
                },
                playerMoveUp: function() {
                    me.Player.setY(me.Player.getY() - 1);
                    me.Client.broadcastMovement(0, -1);
                },
                playerMoveDown: function() {
                    me.Player.setY(me.Player.getY() + 1);
                    me.Client.broadcastMovement(0, 1);
                },
                playerAttack: function() {
                    me.Player.attack(1,1);
                    me.Client.broadcastAttack(1,1);
                }
            }, me.ControlHandler);
        },

        /**
         * Check if the current device on which the game is executed has touch controls
         *
         * @returns {boolean}
         */
        isTouch: function() {
            return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        },


        /**
         * Enable the specific keyboard/touch control
         */
        enable: function() {
           var me = this;

            me.ControlHandler.mapKeys();
        }
    });

    return controls;
});