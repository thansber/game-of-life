define( /* Space */
['jquery', 'underscore', 'data'],
function($, _, Data) {

  var allSpaces = {};

  var Space = function(id, options) {
    this.id = id;
    this.initializer = options.initializer;
    this.executor = options.executor;

    allSpaces[id] = this;
  },

  executors = {
    buyInsurance: function($button, player, board) {
      var type = $button.data('insurance'),
          insurance = Data.insurance[type];

      if (!insurance) {
        return;
      }

      player.addInsurance(type);
      board.adjustCash({ player: player, by: -1 * insurance.price });
    },

    jobs: function($button, player, board) {
      board.selectJob($button);
      player.setJob($button.data('job'));
      setTimeout(function() {

      }, 1000);
    },

    simpleTransaction: function($button, player, board) {
      board.adjustCash({ player: player, by: +$button.data('amount') });
    }
  },

  initializers = {
    jobs: function(player, board) {
      var $jobs = $('#board .action.jobs .job'),
          $playerJob;

      if (!player.job) {
        $playerJob = $jobs.first();
      } else {
        $playerJob = $jobs.filter(function() {
          return $(this).data('job') === player.job.name;
        });
      }

      board.selectJob($playerJob, { clear: !player.job });
    }
  };

  _.extend(Space.prototype, {
    initialize: function(player, board) {
      var dfd = $.Deferred();
      dfd.done(this.initializer);
      return dfd.resolve(player, board);
    },

    execute: function($elem, player, board) {
      var self = this,
          dfd = $.Deferred(),
          nextAction = function() {
            setTimeout(function() {
              board.nextAction();
            }, self.executionDelay || 1000);
          };
      dfd.done(this.executor, nextAction);
      return dfd.resolve($elem, player, board);
    }
  });

  new Space('auto-insurance', { executor: executors.buyInsurance });
  new Space('tuition', { executor: executors.simpleTransaction });
  new Space('jobs', { initializer: initializers.jobs, executor: executors.jobs });


  return {
    from: function(id) {
      return allSpaces[id];
    }
  };
});