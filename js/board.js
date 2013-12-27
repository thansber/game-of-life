define( /* Board */
[
  'category',
  'data',
  'game',
  'scoreboard',
  'space',
  'util'
],
function(
  Category,
  Data,
  Game,
  Scoreboard,
  Space,
  Util
) {

  var $spaces,
      $board,
      $header,
      $categorySpaces,

      _private = {
        clearCashChange: function() {
          $cashChange.find('.type').text('');
          $cashChange.find('.value').text('');
        },
        initializeHeader: function() {
          var currentPlayer = Game.currentPlayer(),
              $cashChange = $header.find('.cash-change');
          $header.find('.name').text(currentPlayer.name);
          this.clearCashChange();
        },
        selectedSpace: function() {
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

    categoryChanged: function($elem) {
      var category = Category.from($elem.data('type')),
          $categorySpace = $categorySpaces.filter(function() {
            return $(this).data('type') === category.id;
          });
      category.initialize(Game.currentPlayer(), this);
      if (category.changeSpace) {
        Util.choiceChanged($categorySpace);
      }
    },

    currentPlayerSpace: function() {
      return this.spaceByType(Game.currentPlayer().at);
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
      var space = Space.from($elem.closest('.space').data('type'));
      space.execute($elem, Game.currentPlayer(), this);
    },

    getRevenge: function($button, player) {
      var revengeOn = Game.playerBy({ name: $button.siblings('.whom').val() }),
          adjustments = [];
      adjustments.push({ player: revengeOn, by: -200000 });
      adjustments.push({ player: player, by: 200000 });
      this.adjustCashMultiple(adjustments);
    },

    goToSpace: function(type) {
      Game.currentPlayer().at = type;
      Util.choiceChanged(this.spaceByType(type));
      this.initializeSpace();
    },

    init: function() {
      $board = $('#board');
      $header = $board.find('.player');
      $spaces = $board.find('.space').not('.category');
      $categorySpaces = $board.find('.space.category');
      $cashChange = $board.find('.cash-change');
    },

    initializeSpace: function() {
      var space = Space.from(_private.selectedSpace().data('type'));
      if (space) {
        space.initialize(Game.currentPlayer(), this);
      }
    },

    nextPlayer: function() {
      Util.choiceChanged(this.currentPlayerSpace());
      this.initializeSpace();
      _private.initializeHeader();
    },

    nextSpace: function() {
      Util.choiceChanged(_private.selectedSpace().next());
      this.initializeSpace();
    },

    nextTollBridgeOwner: function() {
      var newOwner,
          playersWhoCrossed = _.filter(Game.players(), function(player) {
            return !!player.tollBridgeCrossed;
          });

      newOwner = _.first(_.sortBy(playersWhoCrossed, function(player) {
        return player.tollBridgeCrossed;
      }));

      if (newOwner) {
        newOwner.tollBridgeOwned = true;
        newOwner.tollBridgeCrossed = 0;
      }
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
      var $space = $elem.is('.space.millionaire') ? $elem : $elem.closest('.space'),
          isMillionaire = Game.currentPlayer().millionaire;
      $space.toggleClass('first', isMillionaire && Game.numMillionaires() === 1);
      $space.toggleClass('later', isMillionaire && Game.numMillionaires() > 1);
    },

    setLuckyNumber: function($luckyNumber) {
      var luckyNumber = $luckyNumber.closest('.space').find('.lucky-number').index($luckyNumber) + 1;
      Game.currentPlayer().luckyNumber = luckyNumber;
      Util.choiceChanged($luckyNumber);
    },

    setupLuckyNumber: function(player) {
      var $luckyNumber = $categorySpaces.filter('.lucky.number'),
          luckyNumberPlayer = Game.playerWithLuckyNumber();

      $luckyNumber.toggleClass('no-lucky-number', !luckyNumberPlayer);
      $luckyNumber.toggleClass('someone-has-lucky-number', !!luckyNumberPlayer && !player.equals(luckyNumberPlayer));
      $luckyNumber.toggleClass('has-lucky-number', !!luckyNumberPlayer && player.equals(luckyNumberPlayer));
    },

    setupRevenge: function(player) {
      var revengables = Game.playersForRevenge(player),
          $revenge = $categorySpaces.filter('.revenge');

      $revenge.toggleClass('sue', revengables.length > 0);
      $revenge.toggleClass('send back', revengables.length === 0);

      Util.populatePlayerDropdown($revenge.find('.whom'), revengables);
    },

    skipSpace: function() {
      Game.currentPlayer().nextSpace();
      this.nextSpace();
    },

    spaceByType: function(type) {
      return $spaces.filter(function() {
        return $(this).data('type') === type;
      });
    },

    spunLuckyNumber: function(player) {
      this.adjustCashMultiple([
        { player: player, by: -24000 },
        { player: Game.playerWithLuckyNumber(), by: 24000 }
      ]);
    },

    tollBridgeCrossed: function(player) {
      var self = this,
          owner = Game.tollBridgeOwner(),
          amount = 24000,
          $space = this.currentPlayerSpace();

      $space.removeClass('owner crossed');
      if (!owner) {
        player.tollBridgeOwned = true;
        $space.addClass('owner');
        return;
      }

      $space.addClass('crossed');
      player.tollBridgeCrossed = Game.tollBridgeCrossed();

      this.adjustCashMultiple([
        { player: owner, by: amount },
        { player: player, by: -1 * amount }
      ]);
    }
  };
});
