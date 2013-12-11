define(
['actions', 'game', 'player', 'scoreboard', 'jasmine-fixture', 'jasmine-jquery'],
function(Actions, Game, Player, Scoreboard) {

  describe('Actions', function() {
    beforeEach(function() {
      this.actionsFixture = affix('#actions');
      this.adjuster = this.actionsFixture.affix('.adjust-cash');
      this.adjusterValue = this.adjuster.affix('input');

      this.cashChange = affix('#cash-change');
      this.cashChangeType = this.cashChange.affix('.type');
      this.cashChangeValue = this.cashChange.affix('.value');

      this.currentPlayer = new Player();
      Actions.init();
    });

    describe('#adjustCash', function() {
      beforeEach(function() {
        spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);
        spyOn(Scoreboard, 'updatePlayerCash');
      });

      describe('when no value is entered', function() {
        it('does nothing', function() {
          this.adjusterValue.val('');
          Actions.adjustCash(1);
          expect(this.cashChangeType).toHaveText('');
        });
      });

      describe('adding cash', function() {
        beforeEach(function() {
          this.adjusterValue.val('123');
          Actions.adjustCash(1);
        });

        it('sets the proper class to change the color', function() {
          expect(this.cashChange).toHaveClass('gaining');
        });
        it('sets the sign', function() {
          expect(this.cashChangeType).toHaveText('+');
        });
        it('sets the proper class to change the color', function() {
          expect(this.cashChangeValue).toHaveText('123,000');
        });
        it('adds the proper amount to the current player', function() {
          expect(this.currentPlayer.cash).toEqual(133000);
        });
        it('updates the scoreboard', function() {
          expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
        });
      });

      describe('removing cash', function() {
        beforeEach(function() {
          this.adjusterValue.val('45');
          Actions.adjustCash(-1);
        });

        it('sets the proper class to change the color', function() {
          expect(this.cashChange).toHaveClass('losing');
        });
        it('sets the sign', function() {
          expect(this.cashChangeType).toHaveText('-');
        });
        it('sets the proper class to change the color', function() {
          expect(this.cashChangeValue).toHaveText('45,000');
        });
        it('removes the proper amount from the current player', function() {
          expect(this.currentPlayer.cash).toEqual(-35000);
        });
        it('updates the scoreboard', function() {
          expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
        });
      });

      describe('subsequent adjustments', function() {
        it('clears all classes', function() {
          this.adjusterValue.val('1');
          Actions.adjustCash(-1);
          expect(this.cashChange).toHaveClass('losing');
          Actions.adjustCash(1);
          expect(this.cashChange).not.toHaveClass('losing');
        });
      });
    });

  });

});
