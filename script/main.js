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

require(['dispatch', 'lib/domReady'],
   function(dispatch)
{
   dispatch();
});
