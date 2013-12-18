define( /* Summary */
["jquery", "./data"],
function($, Data) {

  var summary = [];
  var s = 0;

  var childrenSummary = function(player) {
    if (player.sons > 0 || player.daughters > 0) {
      if (summary.length > 0) {
        summary[s++] = ", ";
      }
      summary[s++] = "has ";
      if (player.sons > 0) {
        summary[s++] = player.sons + " son" + (player.sons > 1 ? "s" : "");
        if (player.daughters > 0) {
          summary[s++] = " and ";
        }
      }
      if (player.daughters > 0) {
        summary[s++] = player.daughters + " daughter" + (player.daughters > 1 ? "s" : "");
      }
    }
  };

  var insuranceSummary = function(player) {
    if (player.insurance.length > 0) {
      var ownsInsurance = $.merge([], player.insurance);
      if (summary.length > 0) {
        summary[s++] = ", ";
      }
      summary[s++] = " owns ";

      if (ownsInsurance.length === 1) {
        summary[s++] = ownsInsurance[0];
      } else if (ownsInsurance.length === 2) {
        summary[s++] = ownsInsurance.join(" and ");
      } else {
        ownsInsurance[ownsInsurance.length - 1] = "and " + ownsInsurance[ownsInsurance.length - 1];
        summary[s++] = ownsInsurance.join(", ");
      }
      summary[s++] = " insurance";
    }
  };

  var jobSummary = function(player) {
    if (player.job) {
      Data.jobs.forEach(function(job) {
        if (player.job === job.name) {
          summary[s++] = job.summary;
        }
      });
    }
  };

  var marriageSummary = function(player) {
    if (player.married) {
      if (summary.length > 0) {
        summary[s++] = ", ";
      }
      summary[s++] = "is married";
    }
  };

  var millionaireSummary = function(player) {
    if (player.millionaire) {
      if (summary.length > 0) {
        summary[s++] = ", ";
      }
      summary[s++] = "and is a MILLIONAIRE!";
    }
  };

  var tollBridgeSummary = function(player) {
    if (player.tollBridgeOwned) {
      if (summary.length > 0) {
        summary[s++] = ", ";
      }
      summary[s++] = "owns the toll bridge";
    }
  };

  return {
    update: function(player) {
      summary = [];
      s = 0;

      jobSummary(player);
      marriageSummary(player);
      childrenSummary(player);
      insuranceSummary(player);
      tollBridgeSummary(player);
      millionaireSummary(player);

      return summary.join("");
    }
  };
});