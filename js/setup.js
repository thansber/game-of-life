define( /* Setup */
['jquery', 'underscore'],
function($, _) {

  var $setup = null,
      _private = {
        createName: function(i) {
          var name = [];
          _(5).times(function() {
            name.push(String.fromCharCode(65 + i));
          });
          return name.join('');
        },
        randomUpTo: function(max, min) {
          if (min === undefined) {
            min = 1;
          }
          return Math.floor(Math.random() * (max + 1 - min)) + min;
        }
      };

  return {
    autoSetup: function(numPlayers) {
      var availableSwatches;
      for (var i = 0; i < numPlayers; i++) {
        $setup.find('input').val(_private.createName(i));
        availableSwatches = $setup.find('.swatch').not('.disabled');
        availableSwatches.eq(_private.randomUpTo(availableSwatches.length - 1, 0)).click();
        $setup.find('.add').click();
      }
    },

    init: function() {
      $setup = $('#setup');
      $setup.find('input').focus();
    }
  };
});