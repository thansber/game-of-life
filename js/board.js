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
          $cashChange.find('.sign').text('');
          $cashChange.find('.value').text('');
        },
        selectedAction: function() {
          return $actions.filter('.selected');
        },
        selectJob: function($job, options) {
          Util.choiceChanged($job, _.extend({
            parentSelector: '.jobs',
            choiceSelector: '.job',
          }, options));
        },
        updateNavigation: function() {
          var selectedActionIndex = $actions.index(this.selectedAction());
          $board.find('.go.left').toggle(selectedActionIndex > 0);
          $board.find('.go.right').toggle(selectedActionIndex < $actions.length - 1);
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


      player.adjustCash(amount);
      Scoreboard.updatePlayerCash(player);
    },

    buyInsurance: function($button) {
      var type = $button.data('insurance'),
          insurance = Data.insurance[type];

      if (!insurance) {
        return;
      }

      this.adjustCash(-1 * insurance.price);
      Game.currentPlayer().addInsurance(type);
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
      _private.updateNavigation();
    },

    nextPlayer: function() {
      Scoreboard.nextPlayer();
      Util.choiceChanged(_private.currentPlayerAction());
      this.initializeSpace();
      _private.initializeHeader();
      _private.updateNavigation();
    },

    previousAction: function() {
      Util.choiceChanged(_private.selectedAction().prev());
      this.initializeSpace();
      _private.updateNavigation();
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
