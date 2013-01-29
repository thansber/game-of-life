define( /* Util */
["jquery"],
function($) {

  var cleanupHex = function(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex + hex;
    }
    return hex;
  };
  
  var hexToRgb = function(hex) {
    hex = cleanupHex(hex);
    return [
      parseInt(hex.substr(0, 2), 16) / 255, 
      parseInt(hex.substr(2, 2), 16) / 255, 
      parseInt(hex.substr(4), 16) / 255
    ];
  };
  
  return {
    isWhite: function(hex) {
      var rgb = hexToRgb(hex);
      return rgb[0] * 255 === 255 && rgb[1] * 255 === 255 && rgb[2] * 255 === 255;
    },
    textColorFromBackground: function(hex) {
      var rgb = hexToRgb(hex);
      var level = 0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2];
      return level < 0.5 ? "light" : "dark";
    }
  };    
});	