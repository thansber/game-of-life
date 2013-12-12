define( /* Board */
['game', 'scoreboard', 'util'],
function(Game, Scoreboard, Util) {

  var $actions,
      $board,
      initializers = {
        tuition: {},
        jobs: function(player) {
          var $job,
              $playerJob;
          if (!player.job) {
            return;
          }

          $actions.filter('.jobs').each(function() {
            $job = $(this);
            if ($job.data('job') === player.job.name) {
              $playerJob = $job;
            }
          });

          _private.selectJob($playerJob);
        }
      },
      _private = {
        selectedAction: function() {
          return $actions.filter('.selected');
        },
        selectJob: function($job) {
          if ($job && $job.length > 0) {
            Util.choiceChanged($job, {
              parentSelector: '.jobs',
              choiceSelector: '.job'
            });
          }
        },
        updateNavigation: function() {
          $board.find('.go.left').toggle(this.selectedAction().index() > 0);
          $board.find('.go.right').toggle(this.selectedAction().index() < $actions.length - 1);
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
    },

    previousAction: function() {
      Util.choiceChanged(_private.selectedAction().prev());
      this.initializeSpace();
      _private.updateNavigation();
    },

    setJob: function($job) {
      _private.selectJob($job);
      Game.currentPlayer().setJob($job.data('job'));
    }
  };
});
