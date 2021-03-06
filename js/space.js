define( /* Space */
['jquery', 'underscore', 'data'],
function($, _, Data) {

  var allSpaces = {};

  var Space = function(id, options) {
    this.id = id;
    this.initializer = options.initializer;
    this.executor = options.executor;
    this.finalSpace = options.finalSpace;

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

    children: function($button, player, board) {
      player[$button.data('type')]++; // increments sons/daughters
      board.everyonePays({ player: player, by: 1000 });
    },

    dayOfReckoning: function($button, player, board) {
      var adjustments = [];
      _.times(player.sons + player.daughters, function() {
        adjustments.push({ player: player, by: 48000 });
      });

      board.adjustCashMultiple(adjustments);
    },

    jobs: function($button, player, board) {
      board.selectJob($button);
      player.setJob($button.data('job'));
    },

    luckyNumber: function($button, player, board) {
      board.spunLuckyNumber(player);
    },

    marriage: function($button, player, board) {
      var amount = +$button.data("amount");
      if (amount > 0) {
        board.everyonePays({ player: player, by: amount });
      }
      player.getMarried();
    },

    millionaire: function($button, player, board) {
      board.becomeMillionaire(player, $button);
    },

    revenge: function($button, player, board) {
      board.getRevenge($button, player);
    },

    simpleTransaction: function($button, player, board) {
      board.adjustCash({ player: player, by: +$button.data('amount') });
    },

    taxes: function($button, player, board) {
      board.adjustCash({ player: player, by: player.salary() / -2 });
    },

    tollBridge: function($button, player, board) {
      board.tollBridgeCrossed(player);
    },

    tollBridgeFix: function($button, player, board) {
      player.tollBridgeOwned = false;
      board.nextTollBridgeOwner();
      $button.closest('.space').toggleClass('owner not-owner');
    }
  },

  initializers = {
    jobs: function(player, board) {
      var $jobs = $('#board .space.jobs .job'),
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

    millionaire: function(player, board) {
      board.setFirstMillionaire($('#board .space.millionaire'));
    },

    tollBridge: function(player, board) {
      var $tollBridge = $('#board .space.toll-bridge');
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
          nextSpace;

      if (_.isUndefined(delay)) {
        delay = self.executionDelay;
      }
      if (_.isUndefined(delay)) {
        delay = 1000;
      }

      nextSpace = function() {
        setTimeout(function() {
          player.nextSpace();
          board.nextSpace();
        }, +delay);
      };

      dfd.done(this.executor, this.finalSpace ? undefined : nextSpace);
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
  new Space('day-of-reckoning', { executor: executors.dayOfReckoning });
  new Space('millionaire', { initializer: initializers.millionaire, executor: executors.millionaire, finalSpace: true });

  new Space('children', { executor: executors.children });
  new Space('revenge', { executor: executors.revenge });
  new Space('stock-market', { executor: executors.simpleTransaction });
  new Space('lucky-number', { executor: executors.luckyNumber });
  new Space('toll-bridge-fix', { executor: executors.tollBridgeFix });

  return {
    from: function(id) {
      return allSpaces[id];
    }
  };
});