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

      it('sets the start space', function() {
        expect(this.player.at).toEqual(Data.spaces[0].id);
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

    describe('#equals', function() {
      beforeEach(function() {
        this.player.name = 'Name';
        this.otherPlayer = new Player();
      });
      describe('when the names match', function() {
        beforeEach(function() {
          this.otherPlayer.name = 'Name';
        });
        it('returns true', function() {
          expect(this.player.equals(this.otherPlayer)).toBe(true);
        });
      });

      describe('when the names do not match', function() {
        beforeEach(function() {
          this.otherPlayer.name = 'Another Name';
        });
        it('returns false', function() {
          expect(this.player.equals(this.otherPlayer)).toBe(false);
        });
      });

      describe('when a bogus player is provided', function() {
        it('returns false', function() {
          expect(this.player.equals(null)).toBe(false);
        });
      });
    });

    describe('#getMarried', function() {
      it('sets the married flag', function() {
        expect(this.player.married).toBe(false);
        this.player.getMarried();
        expect(this.player.married).toBe(true);
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

    describe('#nextSpace', function() {
      it('goes to the next space', function() {
        expect(this.player.at).toEqual(Data.spaces[0].id);
        this.player.nextSpace();
        expect(this.player.at).toEqual(Data.spaces[1].id);
      });

      describe('when at the last space', function() {
        it('does not advance', function() {
          var lastSpace = _.last(Data.spaces);
          this.player.at = lastSpace.id;
          this.player.nextSpace();
          expect(this.player.at).toEqual(lastSpace.id);
        });
      });
    });

    describe('#salary', function() {
      it('handles a player without a job', function() {
        expect(this.player.salary()).toEqual(0);
      });
      it('returns the player salary based on their job', function() {
        this.player.setJob('j');
        expect(this.player.salary()).toEqual(24000);
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