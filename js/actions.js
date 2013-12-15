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
    adjustCash: function(amount) {
      var amt = +amount,
          changeOptions,
          currentPlayer = Game.currentPlayer();

      if (!amt) {
        return;
      }

      if (amt > 0) {
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
      $cashChange.find('.value').text(Util.formatCash(Math.abs(amt)));

      $cashChange.finish().css({ right: '' }).delay(1000).animate({ right: '8em' }, {
        duration: 1000
      });
      currentPlayer.adjustCash(amt);
      Scoreboard.updatePlayerCash(Scoreboard.currentPlayer(), currentPlayer);
    },

    init: function() {
      $actions = $('#actions');
      $cashChange = $('#cash-change');
    },

    manualCashAdjustment: function(multiplier) {
      var manualAmount = $actions.find('.adjust-cash').find('input').val();
      if (!manualAmount) {
        return;
      }
      this.adjustCash(+manualAmount * 1000 * multiplier);
    },

    resetCashChange: function() {
      $cashChange.find('.type').text('');
      $cashChange.find('.value').text('');
      $cashChange.removeClass('is-animating');
    }
  };
});