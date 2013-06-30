/* global require: true */

require.config({
    baseUrl: '/shared',
    paths: {
        'socket.io': '../socket.io/socket.io',
        'underscore': '../frontend/underscore',
        'mousetrap': '../frontend/mousetrap',
        'domReady': '../frontend/domReady',
        'fastclick': '../frontend/fastclick',
        'dispatch': '../frontend/dispatch',
        'application': '../frontend/application',
        'tilesets/oryx': '../frontend/tilesets/oryx',
        // Bootstrap
        'bootstrap': '../components/bootstrap-assets/js/bootstrap.min',
        'jquery': '../components/jquery/jquery.min'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'mousetrap': {
            exports: 'Mousetrap'
        },
        'socket.io': {
            exports: 'io'
        },
        'jquery': {
            exports: 'jQuery'
        },
        'bootstrap': ['jquery']
    },
    //this is extremely useful for debugging... but remove this on productive!
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['application']);
