define(/* Game */
['jquery', 'underscore', 'player', 'scoreboard'],
function($, _, Player, Scoreboard) {

  var game = null,
      $setup = null,
      _private = {
        swatchFor: function(player) {
          return $setup.find('.swatch').filter(function() {
            return $(this).data('color') === player.color;
          });
        }
      };

  var Game = function() {
    this.players = [];
  };

  $.extend(Game.prototype, {
    addPlayer: function(player) {
      this.players.push(player);
    },

    alreadyUsed: function(name) {
      return _(game.players).some(function(player) {
        return player.name === name;
      });
    }
  });

  return {
    addPlayer: function() {
      var $name = $setup.find('input'),
          $swatch = $setup.find(".selected.swatch"),
          name = $name.val(),
          player = null;

      if (!name || $swatch.length === 0 || game.alreadyUsed(name)) {
        return false;
      }

      $swatch.addClass('disabled').removeClass('selected');
      player = new Player(name, $swatch.data('color'));
      game.addPlayer(player);
      Scoreboard.addPlayer(player);
      $name.focus().select();

      return player;
    },

    currentPlayer: function() {
      return this.playerBy({ elem: Scoreboard.currentPlayer() });
    },

    init: function() {
      game = new Game();
      $setup = $('#setup');
    },

    movePlayer: function($target, howMuch) {
      // $target is the move up/down button
      var $player = Scoreboard.findPlayer($target),
          player = this.playerBy({elem: $player}),
          playerIndex = Scoreboard.indexOf($player),
          movedPlayer = game.players.splice(playerIndex, 1);

      if (howMuch) {
        game.players.splice(playerIndex + howMuch, 0, movedPlayer);
        game.players = _.flatten(game.players);
        Scoreboard.movePlayer($player, howMuch);
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

    playersExcept: function(exceptPlayer) {
      return _.reject(this.players(), function(player) {
        return player.name === exceptPlayer.name;
      });
    },

    removePlayer: function($target) {
      // $target is the delete button
      var $player = Scoreboard.findPlayer($target),
          player = this.playerBy({elem: $player});

      game.players.splice(Scoreboard.indexOf($player), 1);
      Scoreboard.removePlayer($player);
      _private.swatchFor(player).removeClass('disabled');
    },

    resetup: function() {
      $('body').removeClass('game-started');
      Scoreboard.resetup();
    },

    start: function() {
      $('body').addClass('game-started');
    },

    tollBridgeOwner: function() {
      return _.find(this.players(), function(player) {
        return player.tollBridgeOwned;
      });
    }
  };

});