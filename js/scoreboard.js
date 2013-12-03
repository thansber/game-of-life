define( /* Scoreboard */
['jquery', 'util'],
function($, Util) {

  var $scoreboard = null,
      _private = {};

  return {
    addPlayer: function(player) {
      var markup = [], i = 0,
          $markup;
      markup[i++] = '<div class="up arrow"></div>';
      markup[i++] = '<div class="down arrow"></div>';
      markup[i++] = '<div class="player ' + Util.textColorFromBackground(player.color) + '"';
      markup[i++] = ' data-name="' + player.name + '"';
      markup[i++] = ' data-color="' + player.color + '"';
      markup[i++] = '>';
      markup[i++] = '<p class="name">' + player.name + '</p>';
      markup[i++] = '<p class="cash">$<span class="value">' + player.cash + '</p>';
      markup[i++] = '</div>';

      $scoreboard.append(markup.join(''));

      $scoreboard.find('.player').last().css({
        backgroundColor: "#" + player.color,
        borderColor: Util.isWhite(player.color) ? "#666" : "#" + player.color,
      });
    },

    init: function() {
      $scoreboard = $('#scoreboard');
    }
  };
});
