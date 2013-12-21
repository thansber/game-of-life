define(
[
  'game',
  'game-fixture',
  'scoreboard',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  Game,
  GameFixture,
  Scoreboard
) {

  describe('Game', function() {

    beforeEach(function() {
      this.gameFixture = new GameFixture();
    });

    describe('#addPlayer', function() {

      describe('name and color entered', function() {
        beforeEach(function() {
          spyOn(Scoreboard, 'addPlayer');
          this.gameFixture.setPlayers(['Name 1']);
        });

        it('adds a player to the game', function() {
          expect(Game.numPlayers()).toEqual(1);
        });

        it('adds a player to the scoreboard', function() {
          expect(Scoreboard.addPlayer).toHaveBeenCalledWith(Game.playerBy({index: 0}));
        });

        it('disables the selected swatch', function() {
          expect(this.gameFixture.swatch).toHaveClass('disabled');
        });
      });

      describe('when no name has been entered', function() {
        it('does nothing', function() {
          expect(Game.addPlayer()).toBeFalsy();
        });
      });

      describe('when no color has been selected', function() {
        it('does nothing', function() {
          this.gameFixture.name.val('Name');
          this.gameFixture.swatch.removeClass('selected');
          expect(Game.addPlayer()).toBeFalsy();
        });
      });

      describe('when a name already used is used again', function() {
        it('does nothing', function() {
          this.gameFixture.setPlayers(['Name 1', 'Name 1', 'Name 1']);
          this.gameFixture.checkNames(Game.players(), ['Name 1']);
        });
      });
    });

    describe('multiple players', function() {

      beforeEach(function() {
        this.scoreboard = affix('#scoreboard');
        Scoreboard.init();
        this.gameFixture.setPlayers(['Name1', 'Name2', 'Name3', 'Name4']);
      });

      describe('#movePlayer', function() {
        describe('moving left', function() {
          describe('the 2nd player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.left').eq(1), -1);
              this.gameFixture.checkNames(Game.players(), ['Name2', 'Name1', 'Name3', 'Name4']);
            });
          });

          describe('the last player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.left').last(), -1);
              this.gameFixture.checkNames(Game.players(), ['Name1', 'Name2', 'Name4', 'Name3']);
            });
          });
        });

        describe('moving right', function() {
          describe('the 1st player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.right').first(), 1);
              this.gameFixture.checkNames(Game.players(), ['Name2', 'Name1', 'Name3', 'Name4']);
            });
          });
        });
      });

      describe('#numMillionaires', function() {
        describe('when there are no millionaires', function() {
          it('returns 0', function() {
            expect(Game.numMillionaires()).toEqual(0);
          });
        });
        describe('when there are millionaires', function() {
          it('returns the millionaire count', function() {
            Game.playerBy({ index: 0 }).millionaire = true;
            Game.playerBy({ index: 2 }).millionaire = true;
            Game.playerBy({ index: 3 }).millionaire = true;
            expect(Game.numMillionaires()).toEqual(3);
          });
        });
      });

      describe('#playerBy', function() {

        describe('by index', function() {
          it('handles 0', function() {
            expect(Game.playerBy({index: 0}).name).toEqual('Name1');
          });
          it('finds the correct player', function() {
            expect(Game.playerBy({index: 1}).name).toEqual('Name2');
          });
          it('handles a bad index', function() {
            expect(Game.playerBy({index: 20})).toBeFalsy();
          });
        });

        describe('by name', function() {
          it('finds the correct player', function() {
            expect(Game.playerBy({name: 'Name3'})).toBeTruthy();
          });
          it('handles a bad name', function() {
            expect(Game.playerBy({name: 'I-do-not-exist'})).toBeFalsy();
          });
        });

        describe('by elem', function() {
          it('finds the correct player', function() {
            this.testPlayer = affix('div[data-name="Name1"]');
            expect(Game.playerBy({elem: this.testPlayer })).toBeTruthy();
          });
          it('handles an element with a bogus name', function() {
            this.testPlayer = affix('div[data-name="Does not exist"]');
            expect(Game.playerBy({elem: this.testPlayer })).toBeFalsy();
          });
          it('handles an element with a missing name', function() {
            this.testPlayer = affix('div');
            expect(Game.playerBy({elem: this.testPlayer })).toBeFalsy();
          });
        });
      });

      describe('#playersExcept', function() {
        it('returns the correct players', function() {
          this.gameFixture.checkNames(Game.playersExcept(Game.players()[3]), ['Name1', 'Name2', 'Name3']);
        });
        it('leaves out the provided player', function() {
          var exceptPlayer = Game.players()[1],
              players = Game.playersExcept(exceptPlayer);
          expect(players).not.toContain(exceptPlayer);
        });
      });

      describe('#removePlayer', function() {
        describe('when removing the first player', function() {
          beforeEach(function() {
            this.deleteButton = this.scoreboard.find('.delete').first();
          });

          it('removes it', function() {
            expect(Game.numPlayers()).toEqual(4);
            Game.removePlayer(this.deleteButton);
            expect(Game.numPlayers()).toEqual(3);
          });

          it('removes the correct player', function() {
            Game.removePlayer(this.deleteButton);
            this.gameFixture.checkNames(Game.players(), ['Name2', 'Name3', 'Name4']);
          });

          it('re-enables the swatch for the deleted player', function() {
            expect(this.gameFixture.swatch).toHaveClass('disabled');
            Game.removePlayer(this.deleteButton);
            expect(this.gameFixture.swatch).not.toHaveClass('disabled');
          });
        });

        describe('when removing a middle player', function() {
          beforeEach(function() {
            this.deleteButton = this.scoreboard.find('.delete').eq(2);
          });

          it('removes it', function() {
            expect(Game.numPlayers()).toEqual(4);
            Game.removePlayer(this.deleteButton);
            expect(Game.numPlayers()).toEqual(3);
          });

          it('removes the correct player', function() {
            Game.removePlayer(this.deleteButton);
            this.gameFixture.checkNames(Game.players(), ['Name1', 'Name2', 'Name4']);
          });
        });

        describe('when removing the last player', function() {
          beforeEach(function() {
            this.deleteButton = this.scoreboard.find('.delete').last();
          });

          it('removes it', function() {
            expect(Game.numPlayers()).toEqual(4);
            Game.removePlayer(this.deleteButton);
            expect(Game.numPlayers()).toEqual(3);
          });

          it('removes the correct player', function() {
            Game.removePlayer(this.deleteButton);
            this.gameFixture.checkNames(Game.players(), ['Name1', 'Name2', 'Name3']);
          });
        });
      });

    });

  });

});