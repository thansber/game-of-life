define(
['data', 'player'],
function(Data, Player) {

  describe('Player', function() {

    beforeEach(function() {
      this.player = new Player();
    });

    describe('initialization', function() {
      it('sets the starting cash amount', function() {
        expect(this.player.cash).toEqual(10000);
      });

      it('sets the start action', function() {
        expect(this.player.at).toEqual(Data.actions[0]);
      });
    });

    describe('#addInsurance', function() {
      it('adds correctly', function() {
        expect(this.player.insurance.length).toEqual(0);
        this.player.addInsurance('foo');
        this.player.addInsurance('bar');
        expect(this.player.insurance.length).toEqual(2);
      });

      it('does not add duplicate values', function() {
        expect(this.player.insurance.length).toEqual(0);
        this.player.addInsurance('foo');
        this.player.addInsurance('foo');
        expect(this.player.insurance.length).toEqual(1);
      });
    });

    describe('#adjustCash', function() {
      it('returns the player', function() {
        expect(this.player.adjustCash(0)).toEqual(this.player);
      });

      describe('for a positive amount', function() {
        it('changes the cash', function() {
          expect(this.player.adjustCash(5000).cash).toEqual(15000);
        });
      });
      describe('for a negative amount', function() {
        it('changes the cash', function() {
          expect(this.player.adjustCash(-5000).cash).toEqual(5000);
        });
      });
    });

    describe('#hasInsurance', function() {
      beforeEach(function() {
        this.player.addInsurance('foo');
        this.player.addInsurance('moo');
      });
      it('returns true if the player has the provided type', function() {
        expect(this.player.hasInsurance('moo')).toBe(true);
      });
      it('returns false if the player does not have the provided type', function() {
        expect(this.player.hasInsurance('nope')).toBe(false);
      });
    });

    describe('#nextAction', function() {
      it('goes to the next action', function() {
        expect(this.player.at).toEqual(Data.actions[0]);
        this.player.nextAction();
        expect(this.player.at).toEqual(Data.actions[1]);
      });
    });

    describe('#setJob', function() {
      describe('a valid value', function() {
        it('sets the job using the provided value', function() {
          expect(this.player.setJob('d').job).toEqual(Data.jobs[0]);
        });
      });
      describe('an invalid value', function() {
        it('does nothing', function() {
          expect(this.player.setJob('invalid').job).toBeNull();
        });
      });
    });

  });

});