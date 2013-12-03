require([
  'jquery',
  'game',
  'handlers',
  'scoreboard',
  'setup'
], function(
  $,
  Game,
  Handlers,
  Scoreboard,
  Setup
) {

  $(document).ready(function() {
    Handlers.init();
    Game.init();
    Scoreboard.init();
    Setup.init();

    Setup.autoSetup(4);
  });

});