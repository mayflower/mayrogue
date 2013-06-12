define(['underscore', 'util', 'control/keyboard', 'control/touch', 'control/meta'],
    function(_, Util, Keyboard, Touch, Meta)
{
    'use strict';

    var Control = {
        Keyboard: Keyboard,
        Touch: Touch,
        Meta: Meta
    };

    return Control;
});
