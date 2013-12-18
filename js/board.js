define( /* Board */
['data', 'game', 'scoreboard', 'space', 'util'],
function(Data, Game, Scoreboard, Space, Util) {

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
          var playerAt = Game.currentPlayer().at;

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

    everyonePays: function(options) {
      var opt = options || {},
          self = this,
          amount = +opt.by,
          others = Game.playersExcept(opt.player);

      others.forEach(function(player, i) {
        setTimeout(function() {
          self.adjustCash({ player: player, by: amount * -1 });
        }, Scoreboard.cashAnimationDelay() * i);
      });

      setTimeout(function() {
        self.adjustCash({ player: opt.player, by: amount * others.length });
      }, Scoreboard.cashAnimationDelay() * others.length);
    },

    execute: function($elem) {
      var self = this,
          space = Space.from($elem.closest('.action').data('type'));
      space.execute($elem, Game.currentPlayer(), this);
    },

    init: function() {
      $board = $('#board');
      $header = $board.find('.player');
      $actions = $board.find('.action');
      $cashChange = $board.find('.cash-change');
    },

    initializeSpace: function() {
      var space = Space.from(_private.selectedAction().data('type'));
      space.initialize(Game.currentPlayer(), this);
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

    selectJob: function($job, options) {
      Util.choiceChanged($job, _.extend({
        parentSelector: '.jobs',
        choiceSelector: '.job',
      }, options));
    },

    setJob: function($job) {
      this.selectJob($job);
      Game.currentPlayer().setJob($job.data('job'));
    },

    skipAction: function() {
      Game.currentPlayer().nextAction();
      this.nextAction();
    }
  };
});
