define( /* Handlers */
['jquery', 'actions', 'game', 'scoreboard', 'util'],
function($, Actions, Game, Scoreboard, Util) {

  return {
    init: function() {

      $('#setup')
        .on('click', '.swatch', function(e) { Util.choiceChanged($(e.target)); })
        .on('click', '.add', function() { Game.addPlayer(); })
        .on('click', '.start', function() { Game.start(); });

      $('#re-setup').on('click', function() { Game.resetup(); });

      $('#scoreboard')
        .on('click', '.move.up', function() { Game.movePlayer($(this), -1); })
        .on('click', '.move.down', function() { Game.movePlayer($(this), 1); })
        .on('click', '.delete', function() { Game.removePlayer($(this)); });

      $('#cash-change')
        .on('transitionend webkitTransitionEnd', function() { Actions.resetCashChange(); });

      $('#actions')
        .on('click', '.next-player', function() { Scoreboard.nextPlayer(); })
        .on('click', '.add.adjuster', function() { Actions.adjustCash(1); })
        .on('click', '.minus.adjuster', function() { Actions.adjustCash(-1); });

    }
  };
});
