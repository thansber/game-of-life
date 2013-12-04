define( /* Handlers */
['jquery', 'game', 'util'],
function($, Game, Util) {

  return {
    init: function() {

      $('#setup')
        .on('click', '.swatch', function(e) {
          Util.choiceChanged($(e.target));
        })
        .on('click', '.add', function() {
          Game.addPlayer();
        })
        .on('click', '.start', function() {
          Game.start();
        })
        .on('click', '.toggler', function() {
          var $toggler = $(this);
          $toggler.closest('section').toggleClass('collapsed');
          $toggler.toggleClass('show hide');
        });

      $('#scoreboard')
        .on('click', '.move.up', function() {
          Game.movePlayer($(this), -1);
        })
        .on('click', '.delete', function() {
          Game.removePlayer($(this));
        });
    }
  };
});
