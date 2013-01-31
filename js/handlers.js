define(
/* Handlers */ 
["jquery", "player"], 
function($, Player) {
  
  var choiceChanged = function($choice) {
    $choice.siblings().removeClass("selected").end().addClass("selected");
  };
  
  return {
    init: function() {
      
      $("#newPlayer").on("click", function(e) {
        var $this = $(this);
        var $target = $(e.target);
        
        if ($target.hasClass("swatch")) {
          choiceChanged($target);
        } else if ($target.hasClass("add")) {
          Player.add();
          $this.find("input").focus().select();
        } else if ($target.is("input")) {
          return true;
        } else if ($target.hasClass("toggler")) {
          $this.toggleClass("collapsed");
          $target.toggleClass("show hide");
        }
        return true;
      });
      
      $("#game").on("click", function(e) {
        var $target = $(e.target);
        var $player = $target.closest(".player");
        if ($target.hasClass("choice")) { // toggle insurance
          $target.toggleClass("added");
          if ($target.hasClass("added")) {
            Player.buyInsurance($target);
          } else {
            Player.removeInsurance($target);
          }
        } else if ($target.hasClass("child")) { // add a child
          $target.hasClass("boy") ? Player.sonIsBorn($player) : Player.daughterIsBorn($player);
        } else if ($target.hasClass("job")) { // set job
          choiceChanged($target);
          Player.setJob($target);
        } else if ($target.hasClass("adjuster")) { // add/remove cash
          var value = parseInt($target.siblings("input").val(), 10);
          if (isNaN(value)) {
            return false;
          }
          var cashValue = value * 1000 * ($target.hasClass("minus") ? -1 : 1);
          Player.adjustCash($player, cashValue);
        } else if ($target.hasClass("payday")) { // pay day
          Player.payday($player);
        } else if ($target.hasClass("interest")) { // pay day with interest
          Player.payday($player, {interest:true});
        }
      });
      
      $("#game").on("mouseover mouseout", function(e) {
        var $target = $(e.target);
        var $pay = null;
        
        if ($target.hasClass("pay")) {
          $pay = $target;
        } else if ($target.hasClass("payday") || $target.hasClass("interest")) {
          $pay = $target.parent();
        }
        
        if ($pay && $pay.length > 0) {
          $pay.find(".interest").toggleClass("displayed");
        }
      });

    }
  };
});
  