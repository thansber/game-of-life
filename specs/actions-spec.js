define(
[
  'actions',
  'board',
  'game',
  'player',
  'scoreboard',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  Actions,
  Board,
  Game,
  Player,
  Scoreboard
) {

  describe('Actions', function() {
    beforeEach(function() {
      this.actionsFixture = affix('#actions');
      this.adjuster = this.actionsFixture.affix('.adjust-cash');
      this.adjusterValue = this.adjuster.affix('input');

      this.cashChange = affix('#cash-change');
      this.cashChangeType = this.cashChange.affix('.type');
      this.cashChangeValue = this.cashChange.affix('.value');

      this.currentPlayer = new Player();

      spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);
      Actions.init();
    });

    describe('#manualCashAdjustment', function() {
      beforeEach(function() {
        spyOn(Board, 'adjustCash');
      });

      describe('when no amount is provided', function() {
        it('does nothing', function() {
          this.adjusterValue.val('');
          Actions.manualCashAdjustment(1);
          expect(Board.adjustCash).not.toHaveBeenCalled();
        });
      });

      describe('when a positive amount is provided', function() {
        it('adjusts the cash by the amount', function() {
          this.adjusterValue.val('5');
          Actions.manualCashAdjustment(1);
          expect(Board.adjustCash).toHaveBeenCalledWith({
            player: this.currentPlayer,
            by: 5000
          });
        });
      });

      describe('when a negative amount is provided', function() {
        it('adjusts the cash by the amount', function() {
          this.adjusterValue.val('22');
          Actions.manualCashAdjustment(-1);
          expect(Board.adjustCash).toHaveBeenCalledWith({
            player: this.currentPlayer,
            by: -22000
          });
        });
      });
    });

  });

});
