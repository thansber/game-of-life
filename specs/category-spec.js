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

      describe('when the player has no job', function() {
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
    });
  });
});