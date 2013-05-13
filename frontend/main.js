/* global require: true */

require.config({
   baseUrl: 'scripts',
   paths: {
      'socket.io': '../socket.io/socket.io',
      'underscore': '../underscore',
      'mousetrap': '../mousetrap',
      'domReady': '../domReady',
      'fastclick': '../fastclick',
      // Bootstrap
      'bootstrap': '../components/bootstrap-assets/js/bootstrap.min',
      'jquery': '../components/jquery/jquery.min',
      'toastr': '../components/toastr/toastr.min'
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
      'toastr': {
          deps: ['bootstrap', 'jquery'],
          exports: 'Toastr'
      },
      'bootstrap': ['jquery']
   }
});

require(['/dispatch.js', '/gui.js']);
