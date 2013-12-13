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
      this.goLeft = this.board.affix('.go.left');
      this.goRight = this.board.affix('.go.right');

      this.currentPlayer = new Player();
      spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);

      Board.init();
    });

    describe('#initializeSpace', function() {
      describe('for jobs', function() {
        beforeEach(function() {
          this.action = this.board.affix('.action');
          this.action.addClass('selected jobs');
          this.action.data('type', 'jobs');
          this.jobs = this.action.affix('.jobs');
          this.job = this.jobs.affix('.job');
          this.job.data('job', 'p');
          this.otherJob = this.jobs.affix('.job');
          this.otherJob.data('job', 'l');
          this.currentPlayer.setJob('p');
          Board.init();
        });

        it('selects the job linked to the player', function() {
          expect(this.job).not.toHaveClass('selected');
          Board.initializeSpace();
          expect(this.job).toHaveClass('selected');
        });
      });
    });

    describe('#nextAction', function() {
      beforeEach(function() {
        spyOn(Board, 'initializeSpace');
        this.firstAction = this.board.affix('.action');
        this.firstAction.addClass('selected');
        this.nextAction = this.board.affix('.action');
        Board.init();
      });

      it('selects the next available action', function() {
        Board.nextAction();
        expect(this.nextAction).toHaveClass('selected');
      });

      it('displays navigation for the previous action', function() {
        this.goLeft.hide();
        expect(this.goLeft).not.toBeVisible();
        Board.nextAction();
        expect(this.goLeft).toBeVisible();
      });

      describe('going to the last action', function() {
        it('hides navigation for the next action', function() {
          expect(this.goRight).toBeVisible();
          Board.nextAction();
          expect(this.goRight).not.toBeVisible();
        });
      });
    });

    describe('#previousAction', function() {
      beforeEach(function() {
        spyOn(Board, 'initializeSpace');
        this.firstAction = this.board.affix('.action');
        this.nextAction = this.board.affix('.action');
        this.nextAction.addClass('selected');
        Board.init();
      });

      it('selects the previous available action', function() {
        Board.previousAction();
        expect(this.firstAction).toHaveClass('selected');
      });

      it('displays navigation for the next action', function() {
        this.goRight.hide();
        expect(this.goRight).not.toBeVisible();
        Board.previousAction();
        expect(this.goRight).toBeVisible();
      });

      describe('going to the last action', function() {
        it('hides navigation for the previous action', function() {
          expect(this.goLeft).toBeVisible();
          Board.previousAction();
          expect(this.goLeft).not.toBeVisible();
        });
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