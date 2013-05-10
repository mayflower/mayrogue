define(['underscore', 'util'],
    function(_, Util)
{
    "use strict";


    _.each({
        left: function() {
            //new event playerMoveLeft
            new CustomEvent("playerMoveLeft", {});
        },
        right: function() {
            new CustomEvent("playerMoveRight", {});
        },
        up: function() {
            new CustomEvent("playerMoveUp", {});
        },
        down: function() {
            new CustomEvent("playerMoveDown", {});
        },
        ctrl: function() {
            new CustomEvent("playerAttack", {});
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
});