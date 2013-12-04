define(
['scoreboard', 'jasmine-fixture'],
function(Scoreboard) {

  describe('Scoreboard', function() {

    beforeEach(function() {
      this.scoreboard = affix('#scoreboard');
      Scoreboard.init();
    });

    describe('a single player', function() {

      beforeEach(function() {
        this.playerObj = {name: 'Name', color: '000000', cash: 1000000};
        Scoreboard.addPlayer(this.playerObj);
        this.playerContainer = this.scoreboard.find('.player-container');
        this.player = this.playerContainer.find('.player');
        this.cashValue = this.player.find('.cash .value');
      });

      describe('#addPlayer', function() {
        it('sets the name as data', function() {
          expect(this.player).toHaveData('name', 'Name');
        });

        it('sets the color as data', function() {
          expect(this.player).toHaveData('color', '000000');
        });

        it('formats the cash value', function() {
          expect(this.cashValue).toContainText('1,000,000');
        });

        it('sets the up arrow to be the first one', function() {
          expect(this.playerContainer.find('.up.arrow')).toHaveClass('first');
        });

        it('sets the down arrow to be the last one', function() {
          expect(this.playerContainer.find('.down.arrow')).toHaveClass('last');
        });
      });

      describe('#formatCash', function() {
        it('does nothing to values < 1000', function() {
          this.playerObj.cash = 500;
          Scoreboard.formatCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('500');
        });

        it('formats values > 1000', function() {
          this.playerObj.cash = 10500;
          Scoreboard.formatCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('10,500');
        });

        it('formats values > 1000000', function() {
          this.playerObj.cash = 12345678;
          Scoreboard.formatCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('12,345,678');
        });
      });

    });

    describe('multiple players', function() {

      beforeEach(function() {
        Scoreboard.addPlayer({name: 'Name 1', color: '000000', cash: 1000000});
        Scoreboard.addPlayer({name: 'Name 2', color: '000000', cash: 1000000});
        Scoreboard.addPlayer({name: 'Name 3', color: '000000', cash: 1000000});
      });

      describe('#addPlayer', function() {
        it('leaves the up arrow for the first player as the first one', function() {
          expect(this.scoreboard.find('.up.arrow').first()).toHaveClass('first');
        });

        it('does not treat up arrows for players 2-n as the first one', function() {
          expect(this.scoreboard.find('.player-container').filter(':gt(0)').find('.up.arrow')).not.toHaveClass('first');
        });

        it('treats the last up arrow as the last one', function() {
          expect(this.scoreboard.find('.up.arrow').last()).toHaveClass('last');
        });

        it('treats the down arrow for the last player as the last one', function() {
          expect(this.scoreboard.find('.down.arrow').last()).toHaveClass('last');
        });

        it('does not treat down arrows for players 1-(n-1) as the last one', function() {
          expect(this.scoreboard.find('.down.arrow').filter(':lt(2)')).not.toHaveClass('last');
        });
      });

      describe('#findPlayer', function() {
        describe('when the player itself was provided', function() {
          it('returns the player', function() {
            this.playerToFind = this.scoreboard.find('.player').eq(1);
            expect(Scoreboard.findPlayer(this.playerToFind)).toHaveData('name', 'Name 2');
          });
        });

        describe('when an icon is clicked', function() {
          it('returns the player', function() {
            this.playerToFind = this.scoreboard.find('.delete').eq(2);
            expect(Scoreboard.findPlayer(this.playerToFind)).toHaveData('name', 'Name 3');
          });
        });
      });

      describe('#indexOf', function() {
        it('returns the index', function() {
          expect(Scoreboard.indexOf(this.scoreboard.find('.player').first())).toEqual(0);
        });
      });


      describe('#removePlayer', function() {
        it('removes the player', function() {
          expect(this.scoreboard.find('.player-container')).toHaveLength(3);
          Scoreboard.removePlayer(this.scoreboard.find('.player').eq(1));
          expect(this.scoreboard.find('.player-container')).toHaveLength(2);
        });

        describe('when the last player is removed', function() {
          beforeEach(function() {
            Scoreboard.removePlayer(this.scoreboard.find('.player').eq(2));
          });
          it('updates the last up arrow to the previous player', function() {
            expect(this.scoreboard.find('.up.arrow').eq(1)).toHaveClass('last');
          });
          it('updates the last down arrow to the previous player', function() {
            expect(this.scoreboard.find('.down.arrow').eq(1)).toHaveClass('last');
          });
        });
      });
    });
  });

});