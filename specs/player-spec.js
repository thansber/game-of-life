define(
['data', 'player'],
function(Data, Player) {

  describe('Player', function() {

    describe('initialization', function() {
      it('sets the starting cash amount', function() {
        expect(new Player().cash).toEqual(10000);
      });
    });

    describe('#setJob', function() {
      describe('a valid value', function() {
        it('sets the job using the provided value', function() {
          expect(new Player().setJob('d').job).toEqual(Data.jobs[0]);
        });
      });
      describe('an invalid value', function() {
        it('does nothing', function() {
          expect(new Player().setJob('invalid').job).toBeNull();
        });
      });
    });

  });

});