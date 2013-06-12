define(['mapView/vanilla', 'mapView/webGL'],
    function(Vanilla, WebGL)
{
    'use strict';

    var mapView = {
        Vanilla: Vanilla,
        WebGL: WebGL
    };

    return mapView;
});
