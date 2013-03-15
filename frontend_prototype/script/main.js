/* global require: true */

require.config({
   paths: {
      'socket.io': '/socket.io/socket.io.js'
   },
   shim: {
      'lib/underscore': {
         exports: '_'
      },
      'lib/mousetrap': {
         exports: 'Mousetrap'
      },
      'socket.io': {
         exports: 'io'
      }
   }
});

require(['dispatch']);
