define( /* Scoreboard */
['jquery', 'util'],
function($, Util) {

  var $scoreboard = null,
      $cashChange = null,
      _private = {
        containerFor: function($elem) {
          return $elem.hasClass('player-container') ? $elem : $elem.closest('.player-container');
        },
        updateArrows: function() {
          var upArrows = $scoreboard.find('.up.arrow'),
              downArrows = $scoreboard.find('.down.arrow');
          upArrows.removeClass('first last');
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
      markup[i++] =   ' data-color="' + player.color + '">';
      markup[i++] =     '<p class="name">' + player.name + '</p>';
      markup[i++] =     '<p class="cash">$<span class="value"></p>';
      markup[i++] =   '</div>';
      markup[i++] =   '<div class="delete icon" title="Delete this player"></div>';
      markup[i++] = '</div>';

      $scoreboard.append(markup.join(''));
      $player = $scoreboard.find('.player').last();

      this.updatePlayerCash($player, player);
      _private.updateArrows();
    },

    currentPlayer: function() {
      return this.findPlayer($scoreboard.find('.player-container.has-turn'));
    },

    findPlayer: function($elem) {
      if ($elem.is('.player')) {
        return $elem;
      }

      return _private.containerFor($elem).find('.player');
    },

    init: function() {
      $scoreboard = $('#scoreboard');
      $cashChange = $('#cash-change');
    },

    indexOf: function($player) {
      return $scoreboard.find('.player-container').index(_private.containerFor($player));
    },

    movePlayer: function($player, howMuch) {
      var index = this.indexOf($player),
          $movedPlayer = _private.containerFor($player).detach();

      if (howMuch < 0) {
        $movedPlayer.insertBefore($scoreboard.find('.player-container').eq(index + howMuch));
      } else if (howMuch > 0) {
        $movedPlayer.insertAfter($scoreboard.find('.player-container').eq(index));
      }

      _private.updateArrows();
    },

    nextPlayer: function() {
      var $players = $scoreboard.find('.player-container'),
          $current = $players.filter('.has-turn'),
          $next = $current.next();

      $current.removeClass('has-turn');

      if ($current.length === 0 || $next.length === 0) {
        $next = $players.first();
      }

      $next.addClass('has-turn');
      $cashChange.css('top', 70 * this.indexOf($next));
    },

    playerBy: function(options) {
      var opt = options || {},
          positions = {
            'first': 0,
            'last': $scoreboard.find('.player').length - 1
          };

      if (opt.index !== undefined) {
        return $scoreboard.find('.player').eq(opt.index);
      } else if (opt.position && positions[opt.position] !== undefined) {
        return $scoreboard.find('.player').eq(positions[opt.position]);
      }
    },

    removePlayer: function($player) {
      _private.containerFor($player).remove();
      _private.updateArrows();
    },

    resetup: function() {
      $scoreboard.find('.player-container.has-turn').removeClass('has-turn');
    },

    updatePlayerCash: function($player, player) {
      $player.find('.cash .value').text(Util.formatCash(player.cash));
    }

  };
});