define( /* Scoreboard */
['jquery', 'util'],
function($, Util) {

  var $scoreboard = null,
      cashFormatter = /(\d+)(\d{3})/,
      _private = {
        containerFor: function($elem) {
          return $elem.closest('.player-container');
        },
        updateArrows: function() {
          var upArrows = $scoreboard.find('.up.arrow'),
              downArrows = $scoreboard.find('.down.arrow');
          upArrows.removeClass('last');
          upArrows.first().addClass('first');
          upArrows.last().addClass('last');
          downArrows.removeClass('last').last().addClass('last');
        }
      };

  return {
    addPlayer: function(player) {
      var markup = [], i = 0,
          $markup,
          $player;

      markup[i++] = '<div class="player-container">';
      markup[i++] =   '<div class="move up arrow icon" title="Move this player up"></div>';
      markup[i++] =   '<div class="move down arrow icon" title="Move this player down"></div>';
      markup[i++] =   '<div class="player ' + Util.textColorFromBackground(player.color) + '"';
      markup[i++] =   ' data-name="' + player.name + '"';
      markup[i++] =   ' data-color="' + player.color + '"';
      markup[i++] =   '>';
      markup[i++] =     '<p class="name">' + player.name + '</p>';
      markup[i++] =     '<p class="cash">$<span class="value"></p>';
      markup[i++] =   '</div>';
      markup[i++] =   '<div class="delete icon" title="Delete this player"></div>';
      markup[i++] = '</div>';

      $scoreboard.append(markup.join(''));
      $player = $scoreboard.find('.player').last();

      $player.css({
        backgroundColor: "#" + player.color,
        borderColor: Util.isWhite(player.color) ? "#666" : "#" + player.color,
      });

      this.formatCash($player, player);
      _private.updateArrows();
    },

    findPlayer: function($elem) {
      if ($elem.is('.player')) {
        return $elem;
      }

      return _private.containerFor($elem).find('.player');
    },

    formatCash: function($player, player) {
      var formattedCash = '' + player.cash;
      while (cashFormatter.test(formattedCash)) {
        formattedCash = formattedCash.replace(cashFormatter, '$1' + ',' + '$2');
      }
      $player.find('.cash .value').text(formattedCash);
    },

    init: function() {
      $scoreboard = $('#scoreboard');
    },

    indexOf: function($player) {
      return $scoreboard.find('.player-container').index(_private.containerFor($player));
    },

    removePlayer: function($player) {
      _private.containerFor($player).remove();
      _private.updateArrows();
    }
  };
});
