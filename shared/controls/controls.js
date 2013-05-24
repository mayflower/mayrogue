/**
 * Object to abstract the movement/attack control handling, by mapping the specific device controls to
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

        properties: [
            'controlHandler',
            'client',
            {field: '_player', getter: true}
        ],

        /**
         * Creates an control object, which handles the movement/attack events and instanciate the right controls for
         * the device on which the game is played
         *
         * @param {object} client
         */
        create: function(client) {
            var me = this;
            me.setClient(client);

            if(me._isTouch()) {
                me._controlHandler = new Touch();
            } else {
                me._controlHandler = new Keyboard();
            }

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
            me._createMovementListeners();
        },

        /**
         * Create all the movement handlers on the control handler
         */
        _createMovementListeners: function() {
            var me = this;
            me._controlHandler.attachListeners({
                playerMoveLeft: function() {
                    me.getPlayer().setX(me.getPlayer().getX() - 1);
                    me.getClient().broadcastMovement(-1, 0);
                },
                playerMoveRight: function() {
                    me.getPlayer().setX(me.getPlayer().getX() + 1);
                    me.getClient().broadcastMovement(1, 0);
                },
                playerMoveUp: function() {
                    me.getPlayer().setY(me.getPlayer().getY() - 1);
                    me.getClient().broadcastMovement(0, -1);
                },
                playerMoveDown: function() {
                    me.getPlayer().setY(me.getPlayer().getY() + 1);
                    me.getClient().broadcastMovement(0, 1);
                },
                playerAttack: function() {
                    me.getPlayer().attack(1,1);
                    me.getClient().broadcastAttack(1,1);
                }
            }, me._controlHandler);
        },

        setClient: function(client) {
            var me = this;
            me._client = client;
            me._player = me._client.getPlayer();
        },

        /**
         * Check if the current device on which the game is executed has touch controls
         *
         * @returns {boolean}
         */
        _isTouch: function() {
            return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        }
    });

    return controls;
});