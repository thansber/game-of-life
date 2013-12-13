define(
['underscore', 'util', 'jasmine-fixture', 'jasmine-jquery'],
function(_, Util) {

  describe('Util', function() {

    describe('#choiceChanged', function() {

      beforeEach(function() {
        this.container = affix('#container');
        this.choiceClass = '.choice';
      });

      describe('adjacent siblings', function() {
        beforeEach(function() {
          var self = this;
          _(6).times(function() {
            self.container.affix('p' + self.choiceClass);
          });
          this.choices = this.container.find(this.choiceClass);
        });

        it('unselects previously selected things', function() {
          var $wasSelected = this.choices.eq(3);
          $wasSelected.addClass('selected');
          expect($wasSelected).toHaveClass('selected');
          Util.choiceChanged(this.choices.eq(1));
          expect($wasSelected).not.toHaveClass('selected');
        });

        it('selects the provided choice', function() {
          var $goingToBeSelected = this.choices.eq(3);
          expect($goingToBeSelected).not.toHaveClass('selected');
          Util.choiceChanged($goingToBeSelected);
          expect($goingToBeSelected).toHaveClass('selected');
        });

        it('clears all selected choices', function() {
          var $wasSelected = this.choices.eq(3);
          $wasSelected.addClass('selected');
          Util.choiceChanged($wasSelected, {clear:true});
          this.container.find(this.choiceClass).each(function() {
            expect($(this)).not.toHaveClass('selected');
          });
        });
      });

      describe('siblings with different parents', function() {
        beforeEach(function() {
          var self = this,
              $parent;
          this.parentClass = '.parent';
          _(3).times(function() {
            self.container.affix(self.parentClass);
            $parent = self.container.find(self.parentClass).last();
            _(2).times(function() {
              $parent.affix(self.choiceClass);
            });
          });
          this.choices = this.container.find(this.choiceClass);
        });

        it('unselects previously selected things', function() {
          var $wasSelected = this.choices.eq(2);
          $wasSelected.addClass('selected');
          expect($wasSelected).toHaveClass('selected');
          Util.choiceChanged(this.choices.eq(4), {
            parentSelector: '#container',
            choiceSelector: this.choiceClass
          });
          expect($wasSelected).not.toHaveClass('selected');
        });

        it('selects the provided choice', function() {
          var $goingToBeSelected = this.choices.eq(5);
          expect($goingToBeSelected).not.toHaveClass('selected');
          Util.choiceChanged($goingToBeSelected);
          expect($goingToBeSelected).toHaveClass('selected');
        });
      });

      describe('clearing', function() {

      });
    });

  });
});