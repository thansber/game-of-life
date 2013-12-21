define( /* Category */
['jquery', 'underscore'],
function($, _) {

  var allCategories = {};

  var Category = function(id, options) {
    this.id = id;
    this.initializer = options.initializer;

    allCategories[id] = this;
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

      lines.forEach(function(line) {
        markup[i++] = '<li class="line">';
        markup[i++] = line;
        markup[i++] = '</li>';
      });

      $summary.append($(markup.join('')));
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
