define(
[
  'underscore',
  'board',
  'game',
  'player',
  'util',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  _,
  Board,
  Game,
  Player,
  Util
) {

  describe('Board', function() {

    beforeEach(function() {
      this.actionContainer = affix('#actions');
      this.board = this.actionContainer.affix('.board');

      this.currentPlayer = new Player();
      spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);

      Board.init();
    });

    describe('#nextAction', function() {
      beforeEach(function() {
        spyOn(Board, 'initializeSpace');

        this.firstAction = this.board.affix('.action');
        this.firstAction.addClass('selected');
        this.nextAction = this.board.affix('.action');
        this.goLeft = this.board.affix('.go.left');
        this.goRight = this.board.affix('.go.right');
        Board.init();
      });

      it('selects the next available action', function() {
        Board.nextAction();
        expect(this.nextAction).toHaveClass('selected');
      });

      it('displays navigation for the previous action', function() {
        expect(this.goLeft).not.toBeVisible();
        Board.nextAction();
        expect(this.goLeft).toBeVisible();
      });
    });

    describe('#setJob', function() {
      beforeEach(function() {
        spyOn(Util, 'choiceChanged');
        this.job = affix('.job');
        this.job.data('job', 'j');
        Board.setJob(this.job);
      });

      it('selects the provided job', function() {
        expect(Util.choiceChanged).toHaveBeenCalled();
      });

      it('sets the job on the current player', function() {
        expect(Game.currentPlayer().job.desc).toEqual('Journalist');
      });
    });

  });
});