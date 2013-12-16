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
      this.goLeft = this.board.affix('.go.left');
      this.goRight = this.board.affix('.go.right');

      this.cashChange = this.board.affix('.cash-change');
      this.cashChangeType = this.cashChange.affix('.type');
      this.cashChangeValue = this.cashChange.affix('.value');

      this.currentPlayer = new Player();
      spyOn(Game, 'currentPlayer').andReturn(this.currentPlayer);

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
        it('adds the proper amount to the current player', function() {
          expect(this.currentPlayer.cash).toEqual(133000);
        });
        it('updates the scoreboard', function() {
          expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
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
        it('removes the proper amount from the current player', function() {
          expect(this.currentPlayer.cash).toEqual(-35000);
        });
        it('updates the scoreboard', function() {
          expect(Scoreboard.updatePlayerCash).toHaveBeenCalled();
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

    describe('#buyInsurance', function() {
      beforeEach(function() {
        spyOn(Board, 'adjustCash');
        this.insuranceButton = this.board.affix('button');
        this.insuranceButton.data('insurance', 'stock');
      });

      describe('for an invalid type', function() {
        it('does nothing', function() {
          this.insuranceButton.data('insurance', 'invalid');
          Board.buyInsurance(this.insuranceButton);
          expect(Board.adjustCash).not.toHaveBeenCalled();
        });
      });

      describe('for a valid insurance type', function() {
        it('adjusts the player cash by the insurance price', function() {
          this.insuranceButton.data('insurance', 'stock');
          Board.buyInsurance(this.insuranceButton);
          expect(Board.adjustCash).toHaveBeenCalledWith(-50000);
        });
        it('adds the insurance to the player', function() {
          this.insuranceButton.data('insurance', 'life');
          Board.buyInsurance(this.insuranceButton);
          expect(this.currentPlayer.hasInsurance('life')).toBe(true);
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