define( /* SpaceMenu */
['board', 'data'],
function(Board, Data) {

  var $spaceMenu,
      $menu,
      _private = {
        initMenuItems: function() {
          var items = [], i = 0;
          Data.spaces.forEach(function(space) {
            items[i++] = '<li class="item">';
            items[i++] = '<button class="grey button" data-type="';
            items[i++] = space.id;
            items[i++] =  '">';
            items[i++] = space.desc;
            items[i++] = '</button>';
            items[i++] = '</li>';
          });

          $menu.append($(items.join('')));
        }
      };

  return {
    close: function() {
      $spaceMenu.removeClass('displayed');
    },

    go: function($button) {
      this.close();
      Board.goToSpace($button.data('type'));
    },

    init: function() {
      $spaceMenu = $('#space-menu');
      $menu = $spaceMenu.find('.menu');

      _private.initMenuItems();
    },

    open: function() {
      $spaceMenu.addClass('displayed');
    }
  };
});
