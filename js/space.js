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
    },

    marriage: function($button, player, board) {
      var amount = +$button.data("amount");
      if (amount > 0) {
        board.everyonePays({ player: player, by: amount });
      }
      player.getMarried();
    },

    simpleTransaction: function($button, player, board) {
      board.adjustCash({ player: player, by: +$button.data('amount') });
    },

    taxes: function($button, player, board) {
      board.adjustCash({ player: player, by: player.salary() / -2 });
    },

    tollBridge: function($button, player, board) {
      board.tollBridgeCrossed(player);
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
    },

    tollBridge: function(player, board) {
      var $tollBridge = $('#board .action.toll-bridge');
      $tollBridge.removeClass('owner crossed');
      $tollBridge.toggleClass('owner', player.tollBridgeOwned);
      $tollBridge.toggleClass('crossed', player.tollBridgeCrossed);
    }
  };

  _.extend(Space.prototype, {
    initialize: function(player, board) {
      var dfd = $.Deferred();
      dfd.done(this.initializer);
      return dfd.resolve(player, board);
    },

    execute: function($button, player, board) {
      var self = this,
          delay = $button.data('delay'),
          dfd = $.Deferred(),
          nextAction;

      if (_.isUndefined(delay)) {
        delay = self.executionDelay;
      }
      if (_.isUndefined(delay)) {
        delay = 1000;
      }

      nextAction = function() {
        setTimeout(function() {
          player.nextAction();
          board.nextAction();
        }, +delay);
      };

      dfd.done(this.executor, nextAction);
      return dfd.resolve($button, player, board);
    }
  });

  new Space('auto-insurance', { executor: executors.buyInsurance });
  new Space('tuition', { executor: executors.simpleTransaction });
  new Space('jobs', { initializer: initializers.jobs, executor: executors.jobs });
  new Space('life-insurance', { executor: executors.buyInsurance });
  new Space('marriage', { executor: executors.marriage });
  new Space('house', { executor: executors.simpleTransaction });
  new Space('fire-insurance', { executor: executors.buyInsurance });
  new Space('taxes1', { executor: executors.taxes });
  new Space('stock-insurance', { executor: executors.buyInsurance });
  new Space('taxes2', { executor: executors.taxes });
  new Space('taxes3', { executor: executors.taxes });
  new Space('orphanage', { executor: executors.simpleTransaction });
  new Space('toll-bridge', { initializer: initializers.tollBridge, executor: executors.tollBridge });
  new Space('property-taxes', { executor: executors.simpleTransaction });

  return {
    from: function(id) {
      return allSpaces[id];
    }
  };
});