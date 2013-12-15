define(
['game', 'scoreboard', 'jasmine-fixture', 'jasmine-jquery'],
function(Game, Scoreboard) {

  describe('Game', function() {

    beforeEach(function() {
      this.playerFixture = affix('#setup');
      this.name = this.playerFixture.affix('input');
      this.swatch = this.playerFixture.affix('.swatch.selected');
      this.swatch.data('color', '000000');
      Game.init();
    });

    describe('#addPlayer', function() {

      describe('name and color entered', function() {
        beforeEach(function() {
          this.name.val('Name');
        });

        it('adds a player to the game', function() {
          Game.addPlayer();
          expect(Game.numPlayers()).toEqual(1);
        });

        it('adds a player to the scoreboard', function() {
          spyOn(Scoreboard, 'addPlayer');
          Game.addPlayer();
          expect(Scoreboard.addPlayer).toHaveBeenCalledWith(Game.playerBy({index: 0}));
        });

        it('disables the selected swatch', function() {
          Game.addPlayer();
          expect(this.swatch).toHaveClass('disabled');
        });
      });

      describe('when no name has been entered', function() {
        it('does nothing', function() {
          expect(Game.addPlayer()).toBeFalsy();
        });
      });

      describe('when no color has been selected', function() {
        it('does nothing', function() {
          this.name.val('Name');
          this.swatch.removeClass('selected');
          expect(Game.addPlayer()).toBeFalsy();
        });
      });

      describe('when a name already used is used again', function() {
        it('does nothing', function() {
          this.name.val('Name');
          expect(Game.addPlayer()).toBeTruthy();
          this.swatch.removeClass('disabled').addClass('selected');
          expect(Game.addPlayer()).toBeFalsy();
        });
      });
    });

    describe('multiple players', function() {

      beforeEach(function() {
        var self = this,
            names = ['Name1', 'Name2', 'Name3', 'Name4'];

        this.scoreboard = affix('#scoreboard');
        Scoreboard.init();

        names.forEach(function(name) {
          self.name.val(name);
          Game.addPlayer();
          self.swatch.addClass('selected');
        });

        this.checkPlayerNames = function(expectedNames) {
          Game.players().forEach(function(player, i) {
            expect(player.name).toEqual(expectedNames[i]);
          });
        };
      });

      describe('#movePlayer', function() {
        describe('moving left', function() {
          describe('the 2nd player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.left').eq(1), -1);
              this.checkPlayerNames(['Name2', 'Name1', 'Name3', 'Name4']);
            });
          });

          describe('the last player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.left').last(), -1);
              this.checkPlayerNames(['Name1', 'Name2', 'Name4', 'Name3']);
            });
          });
        });

        describe('moving right', function() {
          describe('the 1st player', function() {
            it('re-orders correctly', function() {
              Game.movePlayer(this.scoreboard.find('.move.right').first(), 1);
              this.checkPlayerNames(['Name2', 'Name1', 'Name3', 'Name4']);
            });
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
            this.checkPlayerNames(['Name2', 'Name3', 'Name4']);
          });

          it('re-enables the swatch for the deleted player', function() {
            expect(this.swatch).toHaveClass('disabled');
            Game.removePlayer(this.deleteButton);
            expect(this.swatch).not.toHaveClass('disabled');
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
            this.checkPlayerNames(['Name1', 'Name2', 'Name4']);
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
            this.checkPlayerNames(['Name1', 'Name2', 'Name3']);
          });
        });
      });

    });

  });

});