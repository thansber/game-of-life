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
  var priceFormatter = /(\d+)(\d{3})/;
  
  var adjustCash = function($player, amount) {
    var player = players[getPlayerIndex($player)];
    var $cash = $player.find(".cash");
    player.cash += amount;
    
    $cash.toggleClass("adding", amount > 0).toggleClass("subtracting", amount < 0);
    updateCash($player, amount, "change");
    
    setTimeout(function() { 
      showCash($player, "changing"); 
    }, 20);
    setTimeout(function() { 
      showCash($player, "resetting");
    }, 900);
    setTimeout(function() { 
      updateCash($player, player.cash, "current");
      $cash.removeClass("changing resetting");
      showCash($player, "reset");
    }, 2000);
    setTimeout(function() { 
      $cash.removeClass("reset adding subtracting");
    }, 3000);
  };
  
  var append = function(player) {
    var markup = [], m = 0;
    
    markup[m++] = '<div class="player ' + Util.textColorFromBackground(player.color) + '"';
    markup[m++] = ' data-name="' + player.name + '" data-color="' + player.color + '">';
    markup[m++] = '<p class="name">' + player.name + "</p>";
    markup[m++] = '<div class="cash">';
    markup[m++] = '<p class="current">$<span class="value"></span></p>';
    markup[m++] = '<p class="change">$<span class="value"></span></p>';
    markup[m++] = '</div>';
    
    markup[m++] = appendJobs();
    markup[m++] = appendInsurance();
    markup[m++] = appendChildren();
    markup[m++] = appendCashAdjuster();
    
    markup[m++] = '<button class="red payday">Pay Day!</button>';
    markup[m++] = '</div>';
    
    var $player = $(markup.join(""));
    $game.append($player);
    
    $player.css({
      backgroundColor: "#" + player.color,
      borderColor: Util.isWhite(player.color) ? "#666" : "#" + player.color,
    });
    updateCash($player, player.cash, "current");
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
  
  var appendInsurance = function() {
    var markup = [], m = 0;
    markup[m++] = '<div class="insurance">';
    insurance.forEach(function(ins) {
      markup[m++] = '<p class="choice ' + ins.name + '" data-name="' + ins.name + '" data-price="' + ins.price + '">';
      markup[m++] = ins.name.toUpperCase();
      markup[m++] = '</p>';
    });
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
  
  var everyonePays = function($player) {
    var $otherPlayers = $game.find(".player").not($player);
    $otherPlayers.each(function() {
      adjustCash($(this), -1000);
    });
    adjustCash($player, 1000 * $otherPlayers.size());
  };
  
  var getPlayerIndex = function($player) {
    return $game.find(".player").index($player);
  };
  
  var showCash = function($player, state) {
    $player.find(".cash").addClass(state);
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
        daughters: 0
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
    daughterIsBorn: function($player) {
      players[getPlayerIndex($player)].daughters++;
      updateChildren($player);
      everyonePays($player);
    },
    init: function() {
      $player = $("#newPlayer");
      $game = $("#game");
      
      $player.find(".swatch").each(function() {
        var $this = $(this);
        $this.css("backgroundColor", "#" + $this.data("color"));
      });
  	 },
  	 payday: function($player) {
  	   var player = players[getPlayerIndex($player)];
  	   if (player.job) {
  	     adjustCash($player, player.salary);
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
  	   everyonePays($player);
  	 }
  };    
});	