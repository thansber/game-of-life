define( /* Scoreboard */
['jquery', 'util'],
function($, Util) {

  var $scoreboard = null,
      numPlayerClasses = ['one-player', 'two-players', 'three-players', 'four-players', 'five-players', 'six-players', 'seven-players'],
      _private = {
        containerFor: function($elem) {
          return $elem.hasClass('player-container') ? $elem : $elem.closest('.player-container');
        },
        updateArrows: function() {
          var leftArrows = $scoreboard.find('.left.arrow'),
              rightArrows = $scoreboard.find('.right.arrow');
          leftArrows.removeClass('first').first().addClass('first');
          rightArrows.removeClass('last').last().addClass('last');
        },

        updatePlayerWidths: function() {
          $scoreboard.removeClass(numPlayerClasses.join(' '));
          $scoreboard.addClass(numPlayerClasses[$scoreboard.find('.player-container').length - 1]);
        }
      };

  return {
    addPlayer: function(player) {
      var markup = [], i = 0,
          $markup,
          $player;

      markup[i++] = '<div class="player-container">';
      markup[i++] =   '<div class="player ' + Util.textColorFromBackground(player.color) + '"';
      markup[i++] =   ' data-name="' + player.name + '"';
      markup[i++] =   ' data-color="' + player.color + '">';
      markup[i++] =     '<p class="name">' + player.name + '</p>';
      markup[i++] =     '<p class="cash">$<span class="value"></p>';
      markup[i++] =     '<div class="actions">';
      markup[i++] =       '<p class="move left arrow icon" title="Move this player left"></p>';
      markup[i++] =       '<p class="move right arrow icon" title="Move this player right"></p>';
      markup[i++] =       '<p class="delete icon" title="Delete this player"></p>';
      markup[i++] =     '</div>';
      markup[i++] =   '</div>';
      markup[i++] = '</div>';

      $scoreboard.append(markup.join(''));
      $player = $scoreboard.find('.player').last();

      this.updatePlayerCash(player);
      _private.updateArrows();
      _private.updatePlayerWidths();
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
      } else if (opt.player) {
        return $scoreboard.find('.player').filter(function() {
          return $(this).data('name') === opt.player.name;
        });
      }
    },

    removePlayer: function($player) {
      _private.containerFor($player).remove();
      _private.updateArrows();
      _private.updatePlayerWidths();
    },

    resetup: function() {
      $scoreboard.find('.player-container.has-turn').removeClass('has-turn');
    },

    updatePlayerCash: function(player) {
      var $player = this.playerBy({ player: player });
      if ($player.length === 0) {
        console.error('Unable to find a player using...');
        console.dir(player);
      }
      $player.find('.cash .value').text(Util.formatCash(player.cash));
    }

  };
});
