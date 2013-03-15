/* global require: true */

require.config({
   baseUrl: 'scripts',
   paths: {
      'socket.io': '../socket.io/socket.io',
      'underscore': '../underscore',
      'mousetrap': '../mousetrap',
      'domReady': '../domReady',
      'fastclick': '../fastclick'
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
      }
   }
});

require(['/dispatch.js']);
