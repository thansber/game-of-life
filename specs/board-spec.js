define(
[
  'underscore',
  'board',
  'game',
  'player',
  'scoreboard',
  'util',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  _,
  Board,
  Game,
  Player,
  Scoreboard,
  Util
) {

  describe('Board', function() {

    beforeEach(function() {
      this.board = affix('#board');

      this.cashChange = this.board.affix('.cash-change');
      this.cashChangeType = this.cashChange.affix('.type');
      this.cashChangeValue = this.cashChange.affix('.value');

      this.currentPlayer = new Player();
      spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);
      spyOn(Scoreboard, 'animateCash');
      Board.init();
    });

    describe('#adjustCash', function() {
      beforeEach(function() {
        spyOn(Scoreboard, 'updatePlayerCash');
      });

      describe('when no amount is provided', function() {
        it('does nothing', function() {
          Board.adjustCash({ player: this.currentPlayer, by: 0 });
          expect(this.cashChangeType).toHaveText('');
        });
      });

      describe('adding cash', function() {
        beforeEach(function() {
          Board.adjustCash({ player: this.currentPlayer, by: 123000 });
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

        describe('when animation completes', function() {
          beforeEach(function() {
            Scoreboard.animateCash.mostRecentCall.args[2].apply();
          });
          it('adds the proper amount to the current player', function() {
            expect(this.currentPlayer.cash).toEqual(133000);
          });
          it('updates the scoreboard', function() {
            expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
          });
          it('clears the sign', function() {
            expect(this.cashChangeType).toHaveText('');
          });
          it('clears the value', function() {
            expect(this.cashChangeValue).toHaveText('');
          });
        });
      });

      describe('removing cash', function() {
        beforeEach(function() {
          Board.adjustCash({ player: this.currentPlayer, by: -45000 });
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

        describe('when animation completes', function() {
          beforeEach(function() {
            Scoreboard.animateCash.mostRecentCall.args[2].apply();
          });
          it('removes the proper amount from the current player', function() {
            expect(this.currentPlayer.cash).toEqual(-35000);
          });
          it('updates the scoreboard', function() {
            expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
          });
          it('clears the sign', function() {
            expect(this.cashChangeType).toHaveText('');
          });
          it('clears the value', function() {
            expect(this.cashChangeValue).toHaveText('');
          });
        });
      });

      describe('subsequent adjustments', function() {
        it('clears all classes', function() {
          Board.adjustCash({ player: this.currentPlayer, by: -1000 });
          expect(this.cashChange).toHaveClass('losing');
          Board.adjustCash({ player: this.currentPlayer, by: 1000 });
          expect(this.cashChange).not.toHaveClass('losing');
        });
      });
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
        Board.nextAction();
      });

      it('selects the next available action', function() {
        expect(this.nextAction).toHaveClass('selected');
      });

      it('initializes the space for the next action', function() {
        expect(Board.initializeSpace).toHaveBeenCalled();
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

    describe('#skipAction', function() {
      beforeEach(function() {
        spyOn(this.currentPlayer, 'nextAction');
        spyOn(Board, 'nextAction');
        Board.skipAction();
      });
      it('updates the player to the next action', function() {
        expect(this.currentPlayer.nextAction).toHaveBeenCalled();
      });
      it('moves to the next action', function() {
        expect(Board.nextAction).toHaveBeenCalled();
      });
    });

  });
});