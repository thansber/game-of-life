define( /* Handlers */
['jquery', 'actions', 'board', 'game', 'scoreboard', 'util'],
function($, Actions, Board, Game, Scoreboard, Util) {

  return {
    init: function() {

      $('#setup')
        .on('click', '.swatch', function(e) { Util.choiceChanged($(e.target)); })
        .on('click', '.add', function() { Game.addPlayer(); })
        .on('click', '.start', function() { Game.start(); Actions.nextPlayer(); });

      $('#re-setup').on('click', function() { Game.resetup(); });

      $('#scoreboard')
        .on('click', '.move.left', function() { Game.movePlayer($(this), -1); })
        .on('click', '.move.right', function() { Game.movePlayer($(this), 1); })
        .on('click', '.delete', function() { Game.removePlayer($(this)); });

      $('#actions')
        .on('click', '.next-player', function() { Actions.nextPlayer(); })
        .on('click', '.add.adjuster', function() { Actions.manualCashAdjustment(1); })
        .on('click', '.minus.adjuster', function() { Actions.manualCashAdjustment(-1); })
        .on('click', '.payday', function() { Actions.payPlayer(); })
        .on('click', '.payday-interest', function() { $(this).toggleClass('selected'); });

      $('#board')
        .on('click', '.main .execute', function() { Board.execute($(this)); })
        .on('click', '.main .skip', function() { Board.skipSpace(); })
        .on('click', '.main .job', function() { Board.setJob($(this)); })
        .on('click', '.main .lucky-number', function() { Board.setLuckyNumber($(this)); })
        .on('click', '.categories .category', function() { Board.categoryChanged($(this)); });

    }
  };
});
