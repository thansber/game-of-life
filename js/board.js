define( /* Board */
['data', 'game', 'scoreboard', 'util'],
function(Data, Game, Scoreboard, Util) {

  var $actions,
      $board,

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
    init: function() {
      $board = $('#actions .board');
      $actions = $board.find('.action');
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
