define( /* Keyboard */
['jquery'],
function($) {

  var N_KEY = /n/i,
      P_KEY = /p/i;

  return {
    startListening: function() {
      var $document = $(document);
      $document
        .on('keyup', function(e) {
          var charPressed = String.fromCharCode(e.which);
          if (N_KEY.test(charPressed)) {
            $document.trigger('next:player:key');
            return false;
          } else if (P_KEY.test(charPressed)) {
            $document.trigger('payday:key');
            return false;
          }
          return true;
        });
    },

    stopListening: function() {
      $(document).off('keyup');
    }
  };
});
