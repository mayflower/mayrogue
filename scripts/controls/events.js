//@todo add the player and the broadcastMovement/broadcastAttack function
define(['underscore'],
    function(_)
{
    "use strict";

    _.each({
           playerMoveLeft: function() {
               player.setX(player.getX() - 1);
               broadcastMovement(-1, 0);

           },
           playerMoveRight: function() {
               player.setX(player.getX() + 1);
               broadcastMovement(1, 0);
           },
           playerMoveUp: function() {
               player.setY(player.getY() - 1);
               broadcastMovement(0, -1);
           },
           playerMoveDown: function() {
               player.setY(player.getY() + 1);
               broadcastMovement(0, 1);
           },
           playerAttack: function() {
               // attack local
               player.attack(1,1);
               // send attack to server
               broadcastAttack(1,1);
           }
       }, function(handler, event) {
            window.addEventListener(event, handler);
    });
});
