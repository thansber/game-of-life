define(
/* Handlers */
["jquery", "./drawers", "./player", "../util"],
function($, Drawer, Player, Util) {

  return {
    init: function() {

      $("#newPlayer").on("click", function(e) {
        var $this = $(this);
        var $target = $(e.target);

        if ($target.hasClass("swatch")) {
          Util.choiceChanged($target);
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

        if ($target.hasClass("drawer")) {
          Util.choiceChanged($target);
          Drawer.open($player, $target);
        } else if ($target.hasClass("payday")) { // pay day
          Player.payday($player);
        } else if ($target.hasClass("interest")) { // pay day with interest
          Player.payday($player, {interest:true});
        } else if ($target.hasClass("adjuster")) { // add/remove cash
          var value = parseInt($target.siblings("input").val(), 10);
          if (isNaN(value)) {
            return false;
          }
          var cashValue = value * 1000 * ($target.hasClass("minus") ? -1 : 1);
          Player.adjustCash($player, cashValue);
        } else if ($target.closest(".drawer-content")) { // drawer stuff
          Drawer.click($player, $target);
          Player.updateSummary($player);
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
