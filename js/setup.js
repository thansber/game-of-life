define( /* Setup */
['jquery'],
function($) {

  var $setup = null,
      _private = {
        randomUpTo: function(max, min) {
          if (min === undefined) {
            min = 1;
          }
          return Math.floor(Math.random() * (max + 1 - min)) + min;
        },
      };

  return {
    autoSetup: function(numPlayers) {
      var availableSwatches;
      for (var i = 0; i < numPlayers; i++) {
        $setup.find('input').val(String.fromCharCode(65 + i));
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