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
        },

        /**
         * Map keyboard keys to specific (movement) events
         */
        mapKeys: function() {
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

                var el = document.getElementById('control-' + key);
                if (el) {
                    el.onclick = handler;
                    // pacify JSHint --- avoid "don't use new for side effects..."
                    return new FastClick(el);
                }
            });
        }
    });

    return keyboardControls;
});