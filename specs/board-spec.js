define(
[
  'underscore',
  'board',
  'game',
  'game-fixture',
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
  GameFixture,
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

    describe('#tollBridgeCrossed', function() {
      describe('when nobody owns the toll bridge', function() {
        it('sets the toll bridge ownder to the current player', function() {
          Board.tollBridgeCrossed(Game.currentPlayer());
          expect(Game.currentPlayer().tollBridgeOwned).toBe(true);
        });
      });

      describe('when someone else owns the toll bridge', function() {
        beforeEach(function() {
          spyOn(Board, 'adjustCashMultiple');
          this.gameFixture = new GameFixture();
          this.gameFixture.setPlayers(['Name1', 'Name2']);
          this.owner = Game.playerBy({ index: 1});
          this.owner.tollBridgeOwned = true;
          this.currentPlayer = Game.playerBy({ index: 0 });
          Board.tollBridgeCrossed(this.currentPlayer);
          this.adjustCashArgs = Board.adjustCashMultiple.argsForCall[0][0];
        });

        it('gives the cash to the owner', function() {
          expect(this.adjustCashArgs[0]).toEqual({
            player: this.owner,
            by: 24000
          });
        });

        it('takes cash from the crosser', function() {
          expect(this.adjustCashArgs[1]).toEqual({
            player: this.currentPlayer,
            by: -24000
          });
        });
      });
    });

    xdescribe('#everyonePays', function() {
      beforeEach(function() {
        this.gameFixture = new GameFixture();
        this.gameFixture.setPlayers(['Name1', 'Name2', 'Name3', 'Name4']);

        this.player = Game.playerBy({index: 1});
        spyOn(Board, 'adjustCash');
        spyOn(Scoreboard, 'cashAnimationDelay').andReturn(0);
      });

      describe('takes away for all other players', function() {
        beforeEach(function() {
          Board.everyonePays({ player: this.player, by: 3000 });
          this.adjustCashCalls = Board.adjustCash.argsForCall;
        });
        it('takes away from player 1', function() {
          expect(this.adjustCashCalls[0][0]).toEqual({
            player: Game.playerBy({index: 0}),
            by: -3000
          });
        });
        it('takes away from player 3', function() {
          expect(this.adjustCashCalls[1][0]).toEqual({
            player: Game.playerBy({index: 2}),
            by: -3000
          });
        });
        it('takes away from player 4', function() {
          expect(Board.adjustCash.argsForCall[2][0]).toEqual({
            player: Game.playerBy({index: 3}),
            by: -3000
          });
        });
      });

      it('gives the player the amount for each player', function() {
        Board.everyonePays({ player: this.player, by: 3000 });
        expect(Board.adjustCash).toHaveBeenCalledWith({
          player: this.player,
          by: 9000
        });
      });
    });

    describe('#initializeSpace', function() {
      describe('for jobs', function() {
        beforeEach(function() {
          this.space = this.board.affix('.space');
          this.space.addClass('selected jobs');
          this.space.data('type', 'jobs');
          this.jobs = this.space.affix('.jobs');
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

    describe('#nextSpace', function() {
      beforeEach(function() {
        spyOn(Board, 'initializeSpace');
        this.firstSpace = this.board.affix('.space');
        this.firstSpace.addClass('selected');
        this.nextSpace = this.board.affix('.space');
        Board.init();
        Board.nextSpace();
      });

      it('selects the next available action', function() {
        expect(this.nextSpace).toHaveClass('selected');
      });

      it('initializes the space for the next action', function() {
        expect(Board.initializeSpace).toHaveBeenCalled();
      });
    });

    describe('#setFirstMillionaire', function() {
      beforeEach(function() {
        this.spaces = this.board.affix('.space.millionaire');
        this.gameFixture = new GameFixture();
        this.gameFixture.setPlayers(['Name1', 'Name2', 'Name3']);
        this.currentPlayer = Game.playerBy({ index: 1 });
        Game.currentPlayer.andReturn(this.currentPlayer);
      });
      describe('when we are on the first millionaire', function() {
        it('treats them as the first', function() {
          this.currentPlayer.millionaire = true;
          Board.setFirstMillionaire(this.spaces);
          expect(this.spaces).toHaveClass('first');
        });
      });
      describe('when we are not on a millionaire', function() {
        it('prompts them to become a millionaire', function() {
          Board.setFirstMillionaire(this.spaces);
          expect(this.spaces).not.toHaveClass('first');
          expect(this.spaces).not.toHaveClass('later');
        });
      });
      describe('when we are on a millionaire after the first', function() {
        it('treats them as a later millionaire', function() {
          this.currentPlayer.millionaire = true;
          Game.playerBy({ index: 2 }).millionaire = true;
          Board.setFirstMillionaire(this.spaces);
          expect(this.spaces).toHaveClass('later');
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

    describe('#skipAction', function() {
      beforeEach(function() {
        spyOn(this.currentPlayer, 'nextSpace');
        spyOn(Board, 'nextSpace');
        Board.skipAction();
      });
      it('updates the player to the next action', function() {
        expect(this.currentPlayer.nextSpace).toHaveBeenCalled();
      });
      it('moves to the next action', function() {
        expect(Board.nextSpace).toHaveBeenCalled();
      });
    });

  });
});