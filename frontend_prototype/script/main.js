/* global require: true */

require.config({
   map: {
       '*': {
            'geometry': '/lib/geometry.js',
            'tiles': '/lib/tiles.js',
            'world': '/lib/world.js',
            'util': '/lib/util.js'
       }
   },

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
