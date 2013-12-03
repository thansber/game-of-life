require(
["jquery", "./handlers", "./player"],
function($, Handlers, Player) {
  $(document).ready(function() {
    Handlers.init();
    Player.init();
    $("#newPlayer input").focus();
  });
});