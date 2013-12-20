define(
[
  'board',
  'player',
  'space',
  'jasmine-fixture',
  'jasmine-jquery'
],
function(
  Board,
  Player,
  Space
) {

  describe('Space', function() {

    beforeEach(function() {
      this.player = {name: 'foo'};
    });

    describe('#initialize', function() {
      beforeEach(function() {
        this.initializer = jasmine.createSpy();
        this.space = Space.from('tuition');
        this.originalInitializer = this.space.initializer;
        this.space.initializer = this.initializer;
      });

      afterEach(function() {
        this.space.initializer = this.originalInitializer;
      });

      it('calls the registered initializer', function() {
        this.space.initialize();
        expect(this.initializer).toHaveBeenCalled();
      });
      it('calls any attached handlers with the player', function() {
        var extraCallback = jasmine.createSpy();
        var dfd = this.space.initialize(this.player, Board);
        dfd.done(extraCallback);
        expect(extraCallback).toHaveBeenCalledWith(this.player, Board);
      });
    });

    describe('#execute', function() {
      beforeEach(function() {
        this.executor = jasmine.createSpy();
        this.space = Space.from('tuition');
        this.originalExecutor = this.space.executor;
        this.space.executor = this.executor;
      });

      afterEach(function() {
        this.space.executor = this.originalExecutor;
      });

      it('calls the registered executor', function() {
        this.space.execute(affix('button'));
        expect(this.executor).toHaveBeenCalled();
      });
      it('calls any attached handlers with the element and player', function() {
        this.elem = affix('button');
        var extraCallback = jasmine.createSpy();
        var dfd = this.space.execute(this.elem, this.player, Board);
        dfd.done(extraCallback);
        expect(extraCallback).toHaveBeenCalledWith(this.elem, this.player, Board);
      });
    });

    describe('general execeutors', function() {

      beforeEach(function() {
        this.board = affix('#board');
        this.player = new Player();
        spyOn(Board, 'adjustCash');
        spyOn(Board, 'adjustCashMultiple');
      });

      describe('buying insurance', function() {
        beforeEach(function() {
          this.insuranceButton = this.board.affix('button');
          this.insuranceButton.data('insurance', 'stock');
        });

        describe('for an invalid type', function() {
          it('does nothing', function() {
            this.insuranceButton.data('insurance', 'invalid');
            Space.from('auto-insurance').execute(this.insuranceButton, this.player, Board);
            expect(Board.adjustCash).not.toHaveBeenCalled();
          });
        });

        describe('for a valid insurance type', function() {
          it('adjusts the player cash by the insurance price', function() {
            this.insuranceButton.data('insurance', 'stock');
            Space.from('auto-insurance').execute(this.insuranceButton, this.player, Board);
            expect(Board.adjustCash).toHaveBeenCalledWith({
              player: this.player,
              by: -50000
            });
          });
          it('adds the insurance to the player', function() {
            this.insuranceButton.data('insurance', 'life');
            Space.from('auto-insurance').execute(this.insuranceButton, this.player, Board);
            expect(this.player.hasInsurance('life')).toBe(true);
          });
        });
      });

      describe('day of reckoning', function() {
        beforeEach(function() {
          this.player.sons = 3;
          this.player.daughters = 2;
          Space.from('day-of-reckoning').execute(this.board.affix('button'), this.player, Board);
        });

        it('adds an adjustment for each child', function() {
          expect(Board.adjustCashMultiple.argsForCall[0][0].length).toEqual(5);
        });
      });

      describe('marriage', function() {
        beforeEach(function() {
          this.button = this.board.affix('button');
          spyOn(Board, 'everyonePays');
        });

        it('sets the marriage flag on the player', function() {
          Space.from('marriage').execute(this.button, this.player, Board);
          expect(this.player.married).toBe(true);
        });

        it('does not change funds if there are no presents', function() {
          Space.from('marriage').execute(this.button, this.player, Board);
          expect(Board.everyonePays).not.toHaveBeenCalled();
        });

        it('gives presents to the player', function() {
          this.button.data('amount', 2000);
          Space.from('marriage').execute(this.button, this.player, Board);
          expect(Board.everyonePays).toHaveBeenCalledWith({
            player: this.player,
            by: 2000
          });
        });
      });

      describe('simple transactions', function() {
        beforeEach(function() {
          this.button = this.board.affix('button');
          this.button.data('amount', '-4000');
        });

        it('adjusts the player cash by the amount on the button', function() {
          Space.from('tuition').execute(this.button, this.player, Board);
          expect(Board.adjustCash).toHaveBeenCalledWith({
            player: this.player,
            by: -4000
          });
        });
      });

      describe('taxes', function() {
        beforeEach(function() {
          this.button = this.board.affix('button');
          this.player.setJob('u');
          Space.from('taxes1').execute(this.button, this.player, Board);
        });
        it('takes away half the player salary', function() {
          expect(Board.adjustCash).toHaveBeenCalledWith({
            player: this.player,
            by: -8000
          });
        });
      });
    });
  });
});