define( /* Board */
['data', 'game', 'scoreboard', 'util'],
function(Data, Game, Scoreboard, Util) {

  var $actions,
      $board,
      $header,

      initializers = {
        jobs: function(player) {
          var $jobs = $actions.filter('.jobs').find('.job'),
              $playerJob;

          if (!player.job) {
            $playerJob = $jobs.first();
          } else {
            $playerJob = $jobs.filter(function() {
              return $(this).data('job') === player.job.name;
            });
          }

          _private.selectJob($playerJob, { clear: !player.job });
        }
      },

      _private = {
        clearCashChange: function() {
          $cashChange.find('.type').text('');
          $cashChange.find('.value').text('');
        },
        currentPlayerAction: function() {
          var playerAt = Game.currentPlayer().at,
              $playerAction;

          return $actions.filter(function() {
            return $(this).data('type') === playerAt;
          });
        },
        initializeHeader: function() {
          var currentPlayer = Game.currentPlayer(),
              $cashChange = $header.find('.cash-change');
          $header.find('.name').text(currentPlayer.name);
          this.clearCashChange();
        },
        selectedAction: function() {
          return $actions.filter('.selected');
        },
        selectJob: function($job, options) {
          Util.choiceChanged($job, _.extend({
            parentSelector: '.jobs',
            choiceSelector: '.job',
          }, options));
        }
      };

  return {
    adjustCash: function(options) {
      var opt = options || {},
          amount = +opt.by,
          player = options.player,
          changeOptions = {};

      if (!amount) {
        return;
      }

      changeOptions.sign = amount > 0 ? '+' : '-';
      changeOptions.cssClass = amount > 0 ? 'gaining' : 'losing';

      $cashChange.removeClass('gaining losing').addClass(changeOptions.cssClass);
      $cashChange.find('.type').text(changeOptions.sign);
      $cashChange.find('.value').text(Util.formatCash(Math.abs(amount)));

      Scoreboard.animateCash(player, $cashChange, function() {
        player.adjustCash(amount);
        Scoreboard.updatePlayerCash(player);
        _private.clearCashChange();
      });
    },

    buyInsurance: function($button) {
      var type = $button.data('insurance'),
          insurance = Data.insurance[type],
          player = Game.currentPlayer();

      if (!insurance) {
        return;
      }

      this.adjustCash({ player: player, by: -1 * insurance.price });
      player.addInsurance(type);
    },

    init: function() {
      $board = $('#board');
      $header = $board.find('.player');
      $actions = $board.find('.action');
      $cashChange = $board.find('.cash-change');
    },

    initializeSpace: function() {
      var spaceType = _private.selectedAction().data('type'),
          initializer = initializers[spaceType];

      if (initializer) {
        initializer(Game.currentPlayer());
      }
    },

    nextAction: function() {
      Util.choiceChanged(_private.selectedAction().next());
      this.initializeSpace();
    },

    nextPlayer: function() {
      Util.choiceChanged(_private.currentPlayerAction());
      this.initializeSpace();
      _private.initializeHeader();
    },

    setJob: function($job) {
      _private.selectJob($job);
      Game.currentPlayer().setJob($job.data('job'));
    },

    skipAction: function() {
      Game.currentPlayer().nextAction();
      this.nextAction();
    }
  };
});
