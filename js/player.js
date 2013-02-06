define( /* Player */
["jquery", "util"],
function($, Util) {

  var $player = null;
  var $game = null;
  var players = [];
  
  var insurance = [
    {name:"auto", price:1000}, 
    {name:"life", price:10000}, 
    {name:"fire", price:10000}, 
    {name:"stock", price:50000}
  ];
  var jobs = [
    {name:"d", desc:"Doctor", salary:50000},
    {name:"j", desc:"Journalist", salary:24000},
    {name:"l", desc:"Lawyer", salary:50000},
    {name:"t", desc:"Teacher", salary:20000},
    {name:"p", desc:"Physicist", salary:30000},
    {name:"u", desc:"University", salary:16000},
    {name:"b", desc:"Business", salary:12000}
  ];
  var actions = [
    {type:"tuition", change:function() { return -2000; }},
    {type:"house", change:function() { return -40000; }},
    {type:"taxes", change:function(player) { return player.salary / -2; }},
    {type:"orphanage", change:function() { return -120000; }},
    {type:"property-taxes", change:function() { return -50000; }}
  ];
  var priceFormatter = /(\d+)(\d{3})/;
  
  var adjustCash = function($player, amount, callback) {
    var player = players[getPlayerIndex($player)];
    var $cash = $player.find(".cash");
    player.cash += amount;
    
    $cash.toggleClass("adding", amount > 0).toggleClass("subtracting", amount < 0).addClass("init");
    updateCash($player, amount, "change");
    
    setTimeout(function() { 
      changeCashState($player, {add:"moving"}); 
    }, 20);
    setTimeout(function() { 
      changeCashState($player, {add:"reset", remove:"init moving"});
    }, 550);
    setTimeout(function() { 
      updateCash($player, player.cash, "current");
      changeCashState($player, {add:"moving"});
    }, 1100);
    setTimeout(function() { 
      changeCashState($player, {remove:"adding subtracting reset moving"});
      if (callback) {
        callback.apply(undefined);
      }
    }, 2200);
  };
  
  var append = function(player) {
    var markup = [], m = 0;
    
    markup[m++] = '<div class="player ' + Util.textColorFromBackground(player.color) + '"';
    markup[m++] = ' data-name="' + player.name + '" data-color="' + player.color + '">';
    markup[m++] = '<p class="name">' + player.name + "</p>";
    markup[m++] = '<div class="cash">';
    markup[m++] = '<p class="current amount">$<span class="value"></span></p>';
    markup[m++] = '<p class="change amount">$<span class="value"></span></p>';
    markup[m++] = '</div>';
    
    markup[m++] = appendJobs();
    markup[m++] = appendAssets();
    markup[m++] = appendMarriagePresents();
    markup[m++] = appendActions();
    markup[m++] = appendChildren();
    markup[m++] = appendCashAdjuster();
    markup[m++] = appendPayday();
    
    markup[m++] = '</div>';
    
    var $player = $(markup.join(""));
    $game.append($player);
    
    $player.css({
      backgroundColor: "#" + player.color,
      borderColor: Util.isWhite(player.color) ? "#666" : "#" + player.color,
    });
    updateCash($player, player.cash, "current");
  };
  
  var appendActions = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="actions">';
    markup[m++] =   '<button class="red action tuition">Tuition</button>';
    markup[m++] =   '<button class="red action house">Bought a house</button>';
    markup[m++] =   '<button class="red action taxes">Pay Taxes</button>';
    markup[m++] =   '<button class="red action orphanage">Orphanage</button>';
    markup[m++] =   '<button class="red action property-taxes">Property Taxes</button>';
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendAssets = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="assets">';
    markup[m++] = '<div class="insurance">';
    insurance.forEach(function(ins) {
      markup[m++] = '<p class="choice ' + ins.name + '" data-name="' + ins.name + '" data-price="' + ins.price + '">';
      markup[m++] = ins.name.toUpperCase();
      markup[m++] = '</p>';
    });
    markup[m++] = '</div>';
    markup[m++] = '<div class="toll-owner"><p class="crossed">Crossed toll bridge</p></div>'
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendCashAdjuster = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="adjust-cash">';
    markup[m++] = '<button class="green add adjuster">+</button>';
    markup[m++] = '<input type="text" maxlength="3" />';
    markup[m++] = '<button class="red minus adjuster">-</button>';
    markup[m++] = '<label>(x1000)</label>';
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendChildren = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="children">';
    markup[m++] = '<button class="lightblue child boy">A son is born!</button>';
    markup[m++] = '<button class="pink child girl">A daughter is born!</button>';
    markup[m++] = '<p class="summary"></p>'
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendJobs = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="jobs">';
    jobs.forEach(function(job) {
      markup[m++] = '<p class="job ' + job.name + '" data-name="' + job.name + '" data-salary="' + job.salary + '">';
      markup[m++] = job.desc;
      markup[m++] = '</p>';
    });
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendMarriagePresents = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="marriage-presents">';
    markup[m++] = '<label>Marriage presents</label>';
    markup[m++] = '<button class="green presents good" data-amount="2000">+2,000</button>';
    markup[m++] = '<button class="green presents ok" data-amount="1000">+1,000</button>';
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var appendPayday = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="pay">';
    markup[m++] = '<button class="red payday">Pay Day!</button>';
    markup[m++] = '<button class="red interest">with interest</button>';
    markup[m++] = '</div>';
    return markup.join("");
  };
  
  var changeCashState = function($player, changes) {
    var $cash = $player.find(".cash");
    if (changes.add) {
      $cash.addClass(changes.add);
    }
    if (changes.remove) {
      $cash.removeClass(changes.remove);
    }
  };
  
  var crossedTollBridge = function(player) {
    var tollBridgeOwner = null;
    players.forEach(function(p) {
      if (p.tollBridgeOwned) {
        tollBridgeOwner = p;
      }
    });
    if (tollBridgeOwner) {
      adjustCash(getPlayerMarkup(tollBridgeOwner), 24000);
      adjustCash(getPlayerMarkup(player), -24000);
    } else {
      player.tollBridgeOwned = true;
    }
    return !tollBridgeOwner;
  };
  
  var everyonePays = function($player, amount) {
    var $otherPlayers = $game.find(".player").not($player);
    $otherPlayers.each(function() {
      adjustCash($(this), amount * -1);
    });
    adjustCash($player, amount * $otherPlayers.size());
  };
  
  var getPlayerIndex = function($player) {
    return $game.find(".player").index($player);
  };
  
  var getPlayerMarkup = function(player) {
    var index = -1;
    players.forEach(function(p, i) {
      if (p.name === player.name) {
        index = i;
        return false;
      }
    });

    if (index < 0) {
      return null;
    }
    return $game.find(".player").eq(index);
  };
  
  var updateCash = function($player, value, cashType) {
    var formattedValue = "" + value;
    while (priceFormatter.test(formattedValue)) {
      formattedValue = formattedValue.replace(priceFormatter, '$1' + ',' + '$2');
    };

    if (cashType === "change" && value > 0) {
      formattedValue = "+" + formattedValue;
    }
    $player.find(".cash ." + cashType).find(".value").text(formattedValue);
  };
  
  var updateChildren = function($player) {
    var player = players[getPlayerIndex($player)];
    var summary = "";

    if (player.sons > 0) {
      summary += player.sons + " son" + (player.sons > 1 ? "s" : "");
      if (player.daughters > 0) {
        summary += " and ";
      }
    }
    if (player.daughters > 0) {
      summary += player.daughters + " daughter" + (player.daughters > 1 ? "s" : "");
    }
    $player.find(".children .summary").text(summary);
  };
  
  return {
    add: function() {
      var player = {
        name: $player.find("input").val(),
        color: $player.find(".selected.swatch").data("color"),
        cash: 10000,
        job: "",
        salary: 0,
        insurance: [],
        sons: 0,
        daughters: 0,
        tollBridgeOwned: false
      };
      players.push(player);
      append(player);
    },
    adjustCash: adjustCash,
    buyInsurance: function($insurance) {
      var $player = $insurance.closest(".player");
      var player = players[getPlayerIndex($player)];
      adjustCash($player, -1 * $insurance.data("price"));
      player.insurance.push($insurance.data("name"));
    },
    crossedTollBridgeFirst: function($player) { return crossedTollBridge(players[getPlayerIndex($player)]); },
    daughterIsBorn: function($player) {
      players[getPlayerIndex($player)].daughters++;
      updateChildren($player);
      everyonePays($player, 1000);
    },
    handleAction: function($player, $action) {
      var player = players[getPlayerIndex($player)];
      actions.forEach(function(action) {
        if ($action.hasClass(action.type)) {
          adjustCash($player, action.change(player));
        }
      });
    },
    init: function() {
      $player = $("#newPlayer");
      $game = $("#game");
      
      $player.find(".swatch").each(function() {
        var $this = $(this);
        $this.css("backgroundColor", "#" + $this.data("color"));
      });
  	 },
  	 marriagePresents: function($player, $presents) {
  	   everyonePays($player, parseInt($presents.data("amount"), 10));
  	 },
  	 payday: function($player, opt) {
  	   opt = opt || {};
  	   var player = players[getPlayerIndex($player)];
  	   var interestCallback = null;
      if (opt.interest && player.cash < 0) {
        var interestAmount = Math.ceil(player.cash / -20000) * -1000;
        interestCallback = function() {
          adjustCash($player, interestAmount);
        }
      }
  	   if (player.job) {
  	     adjustCash($player, player.salary, interestCallback);
  	   }
  	 },
  	 removeInsurance: function($insurance) {
  	   var $player = $insurance.closest(".player");
      var player = players[getPlayerIndex($player)];
      var insuranceIndex = player.insurance.indexOf($insurance.data("name"));
      if (insuranceIndex > -1) {
        player.insurance.splice(insuranceIndex, 1);
      }
  	 },
  	 setJob: function($job) {
      var $player = $job.closest(".player");
      var player = players[getPlayerIndex($player)];
      player.job = $job.data("name");
      player.salary = $job.data("salary");
  	 },
  	 sonIsBorn: function($player) {
  	   players[getPlayerIndex($player)].sons++;
  	   updateChildren($player);
  	   everyonePays($player, 1000);
  	 }
  };    
});	