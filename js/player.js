define( /* Player */
["jquery", "data"],
function($, Data) {

  var Player = function(name, color) {
    this.name = name;
    this.color = color;
    this.cash = 10000;
    this.job = null;
    this.insurance = [];
    this.sons = 0;
    this.daughters = 0;
    this.married = false;
    this.tollBridgeOwned = false;
    this.millionaire = false;
  };

  $.extend(Player.prototype, {
    setJob: function(jobId) {
      var self = this;
      Data.jobs.forEach(function(job) {
        if (job.name === jobId) {
          self.job = job;
        }
      });
      return this;
    }
  });

  return Player;
});
