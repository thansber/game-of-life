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
    }},
    {type:"revenge", handle:function($player, $target) {
      if ($target.hasClass("sue")) {
        Player.sue($player);
        return false;
      }
      return true;
    }},
    {type:"toll-bridge", handle:function($player, $crossed) {
      var firstPlayerToCross = Player.crossedTollBridgeFirst($player);
      if (firstPlayerToCross) {
        $crossed.html("Crossed toll bridge first");
      }
      $crossed.addClass("selected");
    }},
    {type:"events", handle:function($player, $event) {
      if ($event.hasClass("millionaire")) {
        Player.becomeMillionaire($player);
      } else if ($event.hasClass("lucky-number")) {
        // TODO: where do I put the drop-down for other players??????
      } else {
        Player.adjustCash($player, $event.data("amount"));
      }
    }}
  ];
  
  var openHandlers = {
    revenge: function($player) {
      var revengeTargets = Player.getPlayersForRevenge($player);
      var $revenge = $player.find(".revenge.drawer-content"); 
      var $whom = $revenge.find(".whom");
      $whom.empty();
      
      revengeTargets.forEach(function(target, i) {
        var option = '<option value="' + target.index + '">' + target.name + '</option>';
        $whom.append($(option));
      });
      
      var anyoneToSue = revengeTargets.length > 0;
      $revenge.find(".nobody").toggle(!anyoneToSue);
      $revenge.find(".sue").toggle(anyoneToSue);
      $whom.toggle(anyoneToSue);
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