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

      $('#cash-change')
        .on('transitionend webkitTransitionEnd', function() { Actions.resetCashChange(); });

      $('#actions')
        .on('click', '.next-player', function() { Actions.nextPlayer(); })
        .on('click', '.add.adjuster', function() { Actions.manualCashAdjustment(1); })
        .on('click', '.minus.adjuster', function() { Actions.manualCashAdjustment(-1); })
        .on('click', '.payday.interest', function() { $(this).toggleClass('selected'); });

      $('#board')
        .on('click', '.main .insurance .buy', function() { Board.buyInsurance($(this)); });

        /*
        .on('click', '.board .job', function() { Board.setJob($(this)); })
        .on('click', '.board .go.left', function() { Board.previousAction(); })
        .on('click', '.board .go.right', function() { Board.nextAction(); })
        .on('click', '.board .action .skip', function() { Board.skipAction(); })
        .on('click', '.board .action .buy', function() { Board.buyInsurance($(this)); });
        */

    }
  };
});
