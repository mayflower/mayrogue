define(['controls/keyboard', 'controls/touch', 'controls/events'],
    function(keyboard, touch, startEvents)
{
    "use strict";

    function enable() {
        //check if touch or keyboard
        if(isTouch()) {
            //enable touch control
            touch();
        } else {
            //enable keyboard control
            keyboard();
        }

        startEvents();
    }

    function isTouch() {
        return touchable = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
    }
});