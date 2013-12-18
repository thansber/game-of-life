define( /* Actions */
['jquery', 'board', 'game', 'scoreboard', 'util'],
function($, Board, Game, Scoreboard, Util) {

  var $actions = null;

  return {
    init: function() {
      $actions = $('#actions');
    },

    manualCashAdjustment: function(multiplier) {
      var manualAmount = $actions.find('.adjust-cash').find('input').val();
      if (!manualAmount) {
        return;
      }
      Board.adjustCash({
        player: Game.currentPlayer(),
        by: +manualAmount * 1000 * multiplier
      });
    },

    nextPlayer: function() {
      Scoreboard.nextPlayer();
      Board.nextPlayer();
    },

    payPlayer: function() {
      var currentPlayer = Game.currentPlayer();
      // TODO: handle interest
      Board.adjustCash({
        player: currentPlayer,
        by: currentPlayer.salary()
      });
    }

  };
});