/* global require: true */

require.config({
   shim: {
      'lib/underscore': {
         exports: '_'
      },
      'lib/mousetrap': {
         exports: 'Mousetrap'
      }
   }
});

require(['dispatch']);
