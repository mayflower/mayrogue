define(['controls/keyboard', 'controls/touch'],
    function(keyboard, touch)
{
    "use strict";

    function isTouch() {
        return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
    }

    //check if touch or keyboard
    if(isTouch()) {
        //enable touch control
        touch();
    } else {
        //enable keyboard control
        keyboard();
    }
});