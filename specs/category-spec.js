define(
[
  'category',
  'player',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  Category,
  Player
) {

  describe('Category', function() {
    beforeEach(function() {
      this.board = affix('#board');
      this.player = new Player();
    });

    describe('#summary initializer', function() {
      beforeEach(function() {
        this.summaryContainer = this.board.affix('.summary.category');
        this.summary = this.summaryContainer.affix('ul.text');
        this.category = Category.from('summary');
      });

      describe('when the player has done nothing', function() {
        it('contains nothing', function() {
          this.category.initialize(this.player);
          expect(this.summary).toBeEmpty();
        });
      });

      describe('when the player has a job', function() {
        it('contains the job summary', function() {
          this.player.setJob('b');
          this.category.initialize(this.player);
          expect(this.summary).toContainText('has a Business Degree');
        });
      });

      describe('when the player owns 1 type of insurance', function() {
        it('contains the insurance summary', function() {
          this.player.addInsurance('life');
          this.category.initialize(this.player);
          expect(this.summary).toContainText('owns life insurance');
        });
      });

      describe('when the player owns >1 type of insurance', function() {
        it('contains the insurance summary', function() {
          this.player.addInsurance('auto');
          this.player.addInsurance('life');
          this.player.addInsurance('stock');
          this.category.initialize(this.player);
          expect(this.summary).toContainText('owns auto, life and stock insurance');
        });
      });

      describe('family summary', function() {
        describe('when the player is married', function() {
          beforeEach(function() {
            this.player.married = true;
          });
          it('contains the proper family summary', function() {
            this.category.initialize(this.player);
            expect(this.summary).toContainText('is married');
          });

          describe('and has 1 son', function() {
            it('contains the proper family summary', function() {
              this.player.sons = 1;
              this.category.initialize(this.player);
              expect(this.summary).toContainText('is married and has 1 son');
            });
          });

          describe('and has 1 daughter', function() {
            it('contains the proper family summary', function() {
              this.player.daughters = 1;
              this.category.initialize(this.player);
              expect(this.summary).toContainText('is married and has 1 daughter');
            });
          });

          describe('and has multiple kids', function() {
            it('contains the proper family summary', function() {
              this.player.daughters = 3;
              this.player.sons = 4;
              this.category.initialize(this.player);
              expect(this.summary).toContainText('is married and has 4 sons and 3 daughters');
            });
          });
        });

        describe('when the player is not married', function() {
          describe('and has multiple sons', function() {
            it('contains the proper family summary', function() {
              this.player.sons = 5;
              this.category.initialize(this.player);
              expect(this.summary).toContainText('has 5 sons');
            });
          });

          describe('and has multiple daughter', function() {
            it('contains the proper family summary', function() {
              this.player.daughters = 2;
              this.category.initialize(this.player);
              expect(this.summary).toContainText('has 2 daughters');
            });
          });
        });
      });

      describe('toll bridge summary', function() {
        describe('when the player owns the toll bridge', function() {
          it('contains the proper summary', function() {
            this.player.tollBridgeOwned = true;
            this.category.initialize(this.player);
            expect(this.summary).toContainText('owns the toll bridge');
          });
        });
        describe('when the player crossed the toll bridge', function() {
          it('contains the proper summary', function() {
            this.player.tollBridgeCrossed = true;
            this.category.initialize(this.player);
            expect(this.summary).toContainText('crossed the toll bridge');
          });
        });
      });

      describe('millionaire summary', function() {
        describe('when the player is a millionaire', function() {
          it('contains the proper summary', function() {
            this.player.millionaire = true;
            this.category.initialize(this.player);
            expect(this.summary).toContainText('is a MILLIONAIRE!');
          });
        });
      });

      describe('lucky number summary', function() {
        describe('when the player has a lucky number', function() {
          it('contains the proper summary', function() {
            this.player.luckyNumber = 4;
            this.category.initialize(this.player);
            expect(this.summary).toContainText('has a lucky number of 4');
          });
        });
      });

    });
  });
});