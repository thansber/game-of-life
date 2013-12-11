define( /* Actions */
['jquery', 'game', 'scoreboard', 'util'],
function($, Game, Scoreboard, Util) {

  var $actions = null,
      $cashChange = null,
      START_ANIMATION_DELAY = 1000,
      _private = {
        animateCashAdjustment: function() {
          $cashChange.animate({left: 400}, {
            duration: 'slow',
            done: function() {
              $cashChange.find('.type').text('');
              $cashChange.find('.value').text('');
              $cashChange.css({ left: 0 });
            }
          });
        }
      };

  return {
    adjustCash: function(multiplier) {
      var amount = $actions.find('.adjust-cash').find('input').val(),
          changeOptions,
          currentPlayer = Game.currentPlayer();

      if (!amount) {
        return;
      }

      if (multiplier > 0) {
        changeOptions = {
          sign: '+',
          cssClass: 'gaining'
        };
      } else {
        changeOptions = {
          sign: '-',
          cssClass: 'losing'
        };
      }

      $cashChange.removeClass('gaining losing').addClass(changeOptions.cssClass);
      $cashChange.find('.type').text(changeOptions.sign);
      $cashChange.find('.value').text(Util.formatCash(amount * 1000));

      $cashChange.addClass('is-animating');
      currentPlayer.adjustCash(+amount * 1000 * multiplier);
      Scoreboard.updatePlayerCash(Scoreboard.currentPlayer(), currentPlayer);
    },

    init: function() {
      $actions = $('#actions');
      $cashChange = $('#cash-change');
    },

    resetCashChange: function() {
      $cashChange.find('.type').text('');
      $cashChange.find('.value').text('');
      $cashChange.removeClass('is-animating');
    }
  };
});