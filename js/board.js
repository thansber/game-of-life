define( /* Board */
['data', 'game', 'scoreboard', 'space', 'util'],
function(Data, Game, Scoreboard, Space, Util) {

  var $spaces,
      $board,
      $header,

      initializers = {
        jobs: function(player) {
          var $jobs = $spaces.filter('.jobs').find('.job'),
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

          return $spaces.filter(function() {
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
          return $spaces.filter('.selected');
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

    adjustCashMultiple: function(adjustments) {
      var self = this;

      adjustments.forEach(function(adjustment, i) {
        setTimeout(function() {
          self.adjustCash(adjustment);
        }, Scoreboard.cashAnimationDelay() * i);
      });
    },

    becomeMillionaire: function(player, $button) {
      var adjustments = [];
      player.millionaire = true;

      if (Game.numMillionaires() === 1) {
        adjustments.push({ player: player, by: 240000 });
      }
      if (player.hasInsurance('life')) {
        adjustments.push({ player: player, by: 8000 });
      }
      if (player.hasInsurance('stock')) {
        adjustments.push({ player: player, by: 120000 });
      }

      this.setFirstMillionaire($button);
      this.adjustCashMultiple(adjustments);
    },

    everyonePays: function(options) {
      var opt = options || {},
          self = this,
          amount = +opt.by,
          others = Game.playersExcept(opt.player),
          adjustments = [];

      others.forEach(function(player, i) {
        adjustments.push({ player: player, by: amount * -1 });
      });

      adjustments.push({ player: opt.player, by: amount * others.length });
      this.adjustCashMultiple(adjustments);
    },

    execute: function($elem) {
      var self = this,
          space = Space.from($elem.closest('.space').data('type'));
      space.execute($elem, Game.currentPlayer(), this);
    },

    init: function() {
      $board = $('#board');
      $header = $board.find('.player');
      $spaces = $board.find('.space');
      $cashChange = $board.find('.cash-change');
    },

    initializeSpace: function() {
      var space = Space.from(_private.selectedAction().data('type'));
      space.initialize(Game.currentPlayer(), this);
    },

    nextSpace: function() {
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

    setFirstMillionaire: function($elem) {
      var $action = $elem.is('.space.millionaire') ? $elem : $elem.closest('.space'),
          isMillionaire = Game.currentPlayer().millionaire;
      $action.toggleClass('first', isMillionaire && Game.numMillionaires() === 1);
      $action.toggleClass('later', isMillionaire && Game.numMillionaires() > 1);
    },

    setLuckyNumber: function($luckyNumber) {
      var luckyNumber = $luckyNumber.closest('.space').find('.lucky-number').index($luckyNumber) + 1;
      Game.currentPlayer().luckyNumber = luckyNumber;
      Util.choiceChanged($luckyNumber);
    },

    skipSpace: function() {
      Game.currentPlayer().nextSpace();
      this.nextSpace();
    },

    tollBridgeCrossed: function(player) {
      var self = this,
          owner = Game.tollBridgeOwner(),
          amount = 24000,
          $action = _private.currentPlayerAction();

      $action.removeClass('owner crossed');
      if (!owner) {
        player.tollBridgeOwned = true;
        $action.addClass('owner');
        return;
      }

      $action.addClass('crossed');
      player.tollBridgeCrossed = true;

      this.adjustCashMultiple([
        { player: owner, by: amount },
        { player: player, by: -1 * amount }
      ]);
    }
  };
});
