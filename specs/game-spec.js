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
        it('returns false', function() {
          expect(Game.addPlayer()).toBe(false);
        });
      });

      describe('when no color has been selected', function() {
        it('returns false', function() {
          this.name.val('Name');
          this.swatch.removeClass('selected');
          expect(Game.addPlayer()).toBe(false);
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
      });

      describe('#movePlayer', function() {
        describe('moving up', function() {
          describe('the 2nd player', function() {
            it('re-orders correctly', function() {
              var expectedNames = ['Name2', 'Name1', 'Name3', 'Name4'],
                  moveButton = this.scoreboard.find('.move.up').eq(1);
              Game.movePlayer(moveButton, -1);
              Game.players().forEach(function(player, i) {
                expect(player.name).toEqual(expectedNames[i]);
              });
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
            var expectedNames = ['Name2', 'Name3', 'Name4'];
            Game.removePlayer(this.deleteButton);
            Game.players().forEach(function(player, i) {
              expect(player.name).toEqual(expectedNames[i]);
            });
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
            var expectedNames = ['Name1', 'Name2', 'Name4'];
            Game.removePlayer(this.deleteButton);
            Game.players().forEach(function(player, i) {
              expect(player.name).toEqual(expectedNames[i]);
            });
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
            var expectedNames = ['Name1', 'Name2', 'Name3'];
            Game.removePlayer(this.deleteButton);
            Game.players().forEach(function(player, i) {
              expect(player.name).toEqual(expectedNames[i]);
            });
          });
        });
      });

    });

  });

});