define( /* Player */
['jquery', 'underscore', 'data'],
function($, _, Data) {

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
    this.at = Data.actions[0];
  };

  $.extend(Player.prototype, {
    addInsurance: function(type) {
      if (!this.hasInsurance(type)) {
        this.insurance.push(type);
      }
    },

    adjustCash: function(amount) {
      this.cash += amount;
      return this;
    },

    getMarried: function() {
      this.married = true;
      return this;
    },

    hasInsurance: function(type) {
      return _.contains(this.insurance, type);
    },

    nextAction: function() {
      var actionIndex = _.indexOf(Data.actions, this.at);
      this.at = Data.actions[++actionIndex];
    },

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
