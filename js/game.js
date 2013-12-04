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

    movePlayer: function($target, howMuch) {
      var $player = Scoreboard.findPlayer($target),
          player = this.playerBy({elem: $player}),
          playerIndex = Scoreboard.indexOf($player),
          movedPlayer = game.players.splice(playerIndex, 1)[0];

      // TODO: update scoreboard
      if (howMuch < 0) {
        game.players.splice(playerIndex + howMuch, 0, movedPlayer);
      }
    },

    numPlayers: function() {
      return game.players.length;
    },

    playerBy: function(options) {
      var opt = options || {},
          foundPlayer = null;

      if (opt.elem) {
        opt.name = opt.elem.data('name');
      }

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
    },

    players: function() {
      return game.players;
    },

    removePlayer: function($target) {
      // $target is the delete button
      var $player = Scoreboard.findPlayer($target),
          player = this.playerBy({elem: $player});

      game.players.splice(Scoreboard.indexOf($player), 1);
      Scoreboard.removePlayer($player);
    }
  };

});