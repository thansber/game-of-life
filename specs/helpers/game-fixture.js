define( /* GameFixture */
['underscore', 'game', 'jasmine-fixture'],
function(_, Game) {

  var GameFixture = function() {
    this.setup = affix('#setup');
    this.name = this.setup.affix('input');
    this.swatch = this.setup.affix('.swatch.selected');
    this.swatch.data('color', '000000');
    Game.init();
  };

  _.extend(GameFixture.prototype, {
    checkNames: function(players, expectedNames) {
      players.forEach(function(player, i) {
        expect(player.name).toEqual(expectedNames[i]);
      });
    },

    setPlayers: function(names) {
      var self = this;
      names.forEach(function(name) {
        self.name.val(name);
        Game.addPlayer();
        self.swatch.addClass('selected');
      });
    }
  });

  return GameFixture;
});