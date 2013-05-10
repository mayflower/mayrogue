define(['util', 'change/base', 'controls/keyboard', 'controls/touch'],
    function(Util, Base, keyboard, touch)
{
    "use strict";

    var control = Util.extend(Base, {

        isTouch: function() {
            return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        },

        //check if touch or keyboard
         apply: function() {
            if(this.isTouch()) {
                //enable touch control
                //touch();
            } else {
                //enable keyboard control
                //keyboard.mapKeys();
            }
        }
    });

    return control;
});