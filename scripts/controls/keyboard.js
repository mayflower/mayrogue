define(['underscore', 'util', 'mousetrap'],
    function(_, Util, Mousetrap)
{
    "use strict";


    var keyboardControls = Util.extend(Util.Base, {

        mixins: [Util.Observable],

        /**
         * constructor
         */
        create: function() {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
            me._mapKeys();
        },

        /**
         * Map keyboard keys to specific (movement) events
         */
        _mapKeys: function() {
            var me = this;
            _.each({
                left: function() {
                    me.fireEvent("playerMoveLeft");
                },
                right: function() {
                    me.fireEvent("playerMoveRight");
                },
                up: function() {
                    me.fireEvent("playerMoveUp");
                },
                down: function() {
                    me.fireEvent("playerMoveDown");
                },
                a: function() {
                    me.fireEvent("playerAttack");
                }
            }, function(handler, key) {
                Mousetrap.bind(key, handler);
            });
        }
    });

    return keyboardControls;
});