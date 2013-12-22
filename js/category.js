define( /* Category */
['jquery', 'underscore'],
function($, _) {

  var allCategories = {};

  var Category = function(id, options) {
    this.id = id;
    this.initializer = options.initializer;

    allCategories[id] = this;
  },

  familySummary = function(player) {
    var hasAnyChildren = player.sons > 0 || player.daughters > 0,
        summary = [];

    if (player.married) {
      summary.push('is married');
      if (hasAnyChildren) {
        summary.push('and');
      }
    }

    if (hasAnyChildren) {
      summary.push('has');
    }

    if (player.sons > 0) {
      summary.push(player.sons);
      summary.push('son' + (player.sons > 1 ? 's' : ''));

      if (player.daughters > 0) {
        summary.push('and');
      }
    }

    if (player.daughters > 0) {
      summary.push(player.daughters);
      summary.push('daughter' + (player.daughters > 1 ? 's' : ''));
    }

    return summary.join(' ');
  },

  initializers = {
    current: function() {

    },

    summary: function(player) {
      var $summary = $("#board .summary.category .text"),
          lines = [],
          markup = [], i = 0;

      if (player.job) {
        lines.push(player.job.summary);
      }

      lines.push(insuranceSummary(player));
      lines.push(familySummary(player));
      lines.push(tollBridgeSummary(player));

      if (player.luckyNumber) {
        lines.push('has a lucky number of ' + player.luckyNumber);
      }

      if (player.millionaire) {
        lines.push('is a MILLIONAIRE!');
      }

      _.compact(lines).forEach(function(line) {
        markup[i++] = '<li class="line">';
        markup[i++] = line;
        markup[i++] = '</li>';
      });

      $summary.append($(markup.join('')));
    }
  },

  insuranceSummary = function(player) {
    var initialInsurance = _.initial(player.insurance),
        lastInsurance = _.last(player.insurance),
        summary = [];

    if (player.insurance.length === 0) {
      return '';
    } else if (player.insurance.length === 1) {
      summary = ['owns', lastInsurance, 'insurance'];
    } else {
      summary = [
        'owns',
        initialInsurance.join(', '),
        'and',
        lastInsurance,
        'insurance'
      ];
    }

    return summary.join(' ');
  },

  tollBridgeSummary = function(player) {
    if (player.tollBridgeOwned) {
      return 'owns the toll bridge';
    } else if (player.tollBridgeCrossed) {
      return 'crossed the toll bridge';
    }
  };

  _.extend(Category.prototype, {
    initialize: function(player) {
      var dfd = $.Deferred();
      dfd.done(this.initializer);
      return dfd.resolve(player);
    },
  });

  new Category('summary', { initializer: initializers.summary });

  return {
    from: function(id) {
      return allCategories[id];
    }
  };
});
