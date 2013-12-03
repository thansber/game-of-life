define(/* Game */
['jquery', 'player', 'scoreboard'],
function($, Player, Scoreboard) {

  var game = null,
      $setup = null;

  var Game = function() {
    this.players = [];
  };

  $.extend(Game.prototype, {
    addPlayer: function(player) {
      this.players.push(player);
    }
  });

  return {
    addPlayer: function() {
      var $name = $setup.find('input'),
          $swatch = $setup.find(".selected.swatch"),
          name = $name.val(),
          player = null;

      if (!name || $swatch.length === 0) {
        return false;
      }

      $swatch.addClass('disabled').removeClass('selected');
      player = new Player(name, $swatch.data('color'));
      game.addPlayer(player);
      Scoreboard.addPlayer(player);
      $name.focus().select();
    },

    init: function() {
      game = new Game();
      $setup = $('#setup');
    },

    numPlayers: function() {
      return game.players.length;
    },

    playerBy: function(options) {
      var opt = options || {},
          foundPlayer = null;
      if (opt.index !== undefined) {
        return game.players[opt.index];
      } else if (opt.name) {
        game.players.forEach(function(player) {
          if (player.name === opt.name) {
            foundPlayer = player;
          }
        });
        return foundPlayer;
      }

      return false;
    }
  };

});