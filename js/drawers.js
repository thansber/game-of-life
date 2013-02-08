define( /* Drawers */
["jquery", "player", "util"],
function($, Player, Util) {

  var contentHandlers = [
    {type:"jobs", handle:function($player, $job) {
        Util.choiceChanged($job);
        Player.setJob($job);
    }},
    {type:"insurance", handle:function($player, $insurance) {
      $insurance.toggleClass("added");
      if ($insurance.hasClass("added")) {
        Player.buyInsurance($insurance);
      } else {
        Player.removeInsurance($insurance);
      }
    }},
    {type:"marriage", handle:function($player, $presents) {
      Player.marriagePresents($player, $presents);
    }},
    {type:"children", handle:function($player, $child) {
      $child.hasClass("boy") ? Player.sonIsBorn($player) : Player.daughterIsBorn($player);
    }},
    {type:"taxes", handle:function($player, $taxes) {
      Player.payTaxes($player, $taxes.data("type"));
    }}
  ];
  
  var openHandlers = {
    revenge: function($player) {
      var revengeTargets = Player.getPlayersForRevenge($player);
      var $whom = $player.find(".revenge.drawer-content .whom");
      $whom.empty();
      revengeTargets.forEach(function(target, i) {
        var option = '<option value="' + target.index + '">' + target.name + '</option>';
        $whom.append($(option));
      });
    }
  };
  
  return {
    click: function($player, $target) {
      var $content = $target.closest(".drawer-content");
      contentHandlers.forEach(function(handler) {
        if ($content.hasClass(handler.type)) {
          handler.handle($player, $target);
        }
      });
    },
    open: function($player, $drawer) {
      var type = $drawer.data("type");
      $player.find(".drawer-content").hide().filter("." + type).show();
      $.each(openHandlers, function(key, handler) {
        if (key === type) {
          handler($player);
        }
      });
    }
  };
});	