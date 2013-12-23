define( /* Util */
["jquery"],
function($) {

  var cashFormatter = /(\d+)(\d{3})/,

  cleanupHex = function(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex + hex;
    }
    return hex;
  },

  hexToRgb = function(hex) {
    hex = cleanupHex(hex);
    return [
      parseInt(hex.substr(0, 2), 16) / 255,
      parseInt(hex.substr(2, 2), 16) / 255,
      parseInt(hex.substr(4), 16) / 255
    ];
  };

  return {
    choiceChanged: function($choice, options) {
      var $siblings,
          opt = options || {};

      if (opt.parentSelector && opt.choiceSelector) {
        $siblings = $choice.closest(opt.parentSelector).find(opt.choiceSelector);
      } else {
        $siblings = $choice.siblings();
      }
      $siblings.removeClass('selected');

      if (opt.clear) {
        $choice.removeClass('selected');
      } else {
        $choice.addClass('selected');
      }
    },
    formatCash: function(cashValue) {
      var formattedCash = '' + cashValue;
      while (cashFormatter.test(formattedCash)) {
        formattedCash = formattedCash.replace(cashFormatter, '$1' + ',' + '$2');
      }
      return formattedCash;
    },
    isWhite: function(hex) {
      var rgb = hexToRgb(hex);
      return rgb[0] * 255 === 255 && rgb[1] * 255 === 255 && rgb[2] * 255 === 255;
    },
    populatePlayerDropdown: function($select, players) {
      players.forEach(function(player) {
        $select.append($('<option value="' + player.name + '">' + player.name + '</option>'));
      });
    },
    textColorFromBackground: function(hex) {
      var rgb = hexToRgb(hex);
      var level = 0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2];
      return level < 0.5 ? "light" : "dark";
    }
  };
});