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

        it('sets the left arrow to be the first one', function() {
          expect(this.playerContainer.find('.left.arrow')).toHaveClass('first');
        });

        it('sets the right arrow to be the last one', function() {
          expect(this.playerContainer.find('.right.arrow')).toHaveClass('last');
        });
      });

      describe('#updatePlayerCash', function() {
        it('does nothing to values < 1000', function() {
          this.playerObj.cash = 500;
          Scoreboard.updatePlayerCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('500');
        });

        it('formats values > 1000', function() {
          this.playerObj.cash = 10500;
          Scoreboard.updatePlayerCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('10,500');
        });

        it('formats values > 1000000', function() {
          this.playerObj.cash = 12345678;
          Scoreboard.updatePlayerCash(this.player, this.playerObj);
          expect(this.cashValue).toContainText('12,345,678');
        });
      });

    });

    describe('multiple players', function() {

      beforeEach(function() {
        Scoreboard.addPlayer({name: 'Name 1', color: '000000', cash: 1000000});
        Scoreboard.addPlayer({name: 'Name 2', color: '000000', cash: 1000000});
        Scoreboard.addPlayer({name: 'Name 3', color: '000000', cash: 1000000});
        Scoreboard.addPlayer({name: 'Name 4', color: '000000', cash: 1000000});
      });

      describe('#addPlayer', function() {
        it('leaves the left arrow for the first player as the first one', function() {
          expect(this.scoreboard.find('.left.arrow').first()).toHaveClass('first');
        });

        it('does not treat left arrows for players 2-n as the first one', function() {
          expect(this.scoreboard.find('.player-container').not(':first').find('.left.arrow')).not.toHaveClass('first');
        });

        it('treats the right arrow for the last player as the last one', function() {
          expect(this.scoreboard.find('.right.arrow').last()).toHaveClass('last');
        });

        it('does not treat right arrows for players 1-(n-1) as the last one', function() {
          expect(this.scoreboard.find('.right.arrow').not(':last')).not.toHaveClass('last');
        });
      });

      describe('#currentPlayer', function() {
        it('returns the current player', function() {
          Scoreboard.nextPlayer();
          Scoreboard.nextPlayer();
          Scoreboard.nextPlayer();
          expect(Scoreboard.currentPlayer()).toHaveData('name', 'Name 3');
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

        it('handles a player container', function() {
          expect(Scoreboard.indexOf(this.scoreboard.find('.player-container').eq(2))).toEqual(2);
        });
      });

      describe('#movePlayer', function() {
        describe('moving left', function() {
          describe('the 2nd player', function() {
            it('swaps the 1st and 2nd players', function() {
              this.playerToMove = Scoreboard.playerBy({ index: 1 });
              Scoreboard.movePlayer(this.playerToMove, -1);
              expect(Scoreboard.playerBy({ position: 'first' })).toHaveData('name', 'Name 2');
            });
          });

          describe('the last player', function() {
            it('swaps the last and 2nd-to-last players', function() {
              this.playerToMove = Scoreboard.playerBy({ position: 'last' });
              Scoreboard.movePlayer(this.playerToMove, -1);
              expect(Scoreboard.playerBy({ index: 2 })).toHaveData('name', 'Name 4');
            });
          });
        });

        describe('moving right', function() {
          describe('the 1st player', function() {
            it('swaps the 1st and 2nd players', function() {
              this.playerToMove = Scoreboard.playerBy({ position: 'first' });
              Scoreboard.movePlayer(this.playerToMove, 1);
              expect(Scoreboard.playerBy({ index: 0 })).toHaveData('name', 'Name 2');
              expect(Scoreboard.playerBy({ index: 1 })).toHaveData('name', 'Name 1');
            });
          });

          describe('the 2nd to last player', function() {
            it('swaps the last and 2nd-to-last players', function() {
              this.playerToMove = Scoreboard.playerBy({ index: 2 });
              Scoreboard.movePlayer(this.playerToMove, 1);
              expect(Scoreboard.playerBy({ index: 2 })).toHaveData('name', 'Name 4');
              expect(Scoreboard.playerBy({ position: 'last' })).toHaveData('name', 'Name 3');
            });
          });
        });
      });

      describe('#nextPlayer', function() {
        beforeEach(function() {
          this.players = this.scoreboard.find('.player-container');
        });
        describe('when starting the game', function() {
          it('gives the first player the turn', function() {
            Scoreboard.nextPlayer();
            expect(this.players.first()).toHaveClass('has-turn');
          });
        });

        describe('after the game has started', function() {
          it('gives the next player the turn', function() {
            Scoreboard.nextPlayer();
            Scoreboard.nextPlayer();
            expect(this.players.eq(0)).not.toHaveClass('has-turn');
            expect(this.players.eq(1)).toHaveClass('has-turn');
          });
        });

        describe('going from last player to first', function() {
          it('should loop back to the first player', function() {
            _(this.players.length).times(function() {
              Scoreboard.nextPlayer();
            });
            expect(this.players.last()).toHaveClass('has-turn');
            Scoreboard.nextPlayer();
            expect(this.players.first()).toHaveClass('has-turn');
            expect(this.players.last()).not.toHaveClass('has-turn');
          });
        });
      });

      describe('#removePlayer', function() {
        it('removes the player', function() {
          expect(this.scoreboard.find('.player-container')).toHaveLength(4);
          Scoreboard.removePlayer(Scoreboard.playerBy({ index: 1 }));
          expect(this.scoreboard.find('.player-container')).toHaveLength(3);
        });

        describe('when the last player is removed', function() {
          beforeEach(function() {
            Scoreboard.removePlayer(Scoreboard.playerBy({ position: 'last' }));
          });
          it('hides the right arrow for the new last player', function() {
            expect(this.scoreboard.find('.right.arrow').eq(2)).toHaveClass('last');
          });
        });
      });
    });
  });

});