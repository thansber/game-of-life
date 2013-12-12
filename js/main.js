requirejs.config({
    baseUrl : 'js',
    paths: {
        'jquery': 'lib/jquery-2.0.3.min',
        'underscore': 'lib/underscore-min'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
    }
});

require([
  'jquery',
  'actions',
  'board',
  'game',
  'handlers',
  'scoreboard',
  'setup'
], function(
  $,
  Actions,
  Board,
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
    Actions.init();
    Board.init();

    Setup.autoSetup(4);
  });

});