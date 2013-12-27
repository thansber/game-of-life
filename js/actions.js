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
      var player = Game.currentPlayer(),
          withInterest = $actions.find('.payday-interest').hasClass('selected'),
          adjustments = [{
            player: player,
            by: player.salary()
          }];

      if (withInterest && player.cash + player.salary() < 0) {
        adjustments.push({
          player: player,
          by: Math.ceil(player.cash / 20000) * 1000
        });
      }

      Board.adjustCashMultiple(adjustments);
    }

  };
});