describe("multiSelect", function() {

  describe('init', function(){
    it ('should be chainable', function(){
      select.multiSelect().addClass('chainable');
      expect(select.hasClass('chainable')).toBeTruthy();
    });
    describe('without options', function(){

      beforeEach(function() {
        select.multiSelect();
        msContainer = select.next();
      });

      it('should hide the original select', function(){
        expect(select.css('position')).toBe('absolute');
        expect(select.css('left')).toBe('-9999px');
      });

      it('should create a container', function(){
        expect(msContainer).toBe('div.ms-container');
      });

      it ('should create a selectable and a selection container', function(){
        expect(msContainer).toContain('div.ms-selectable, div.ms-selection');
      });

      it ('should create a list for both selectable and selection container', function(){
        expect(msContainer).toContain('div.ms-selectable ul.ms-list, div.ms-selection ul.ms-list');
      });

      it ('should populate the selectable list', function(){
        expect($('.ms-selectable ul.ms-list li').length).toEqual(10);
      });

      it ('should populate the selection list', function(){
        expect($('.ms-selectable ul.ms-list li').length).toEqual(10);
      });

    });

    describe('with pre-selected options', function(){

      var selectedValues = [];

      beforeEach(function() {
        var firstOption = select.children('option').first();
        var lastOption = select.children('option').last();
        firstOption.prop('selected', true);
        lastOption.prop('selected', true);
        selectedValues.push(firstOption.val(), lastOption.val());
        select.multiSelect();
        msContainer = select.next();
      });

      it ('should select the pre-selected options', function(){
        $.each(selectedValues, function(index, value){
          expect($('.ms-selectable ul.ms-list li#'+value+'-selectable')).toBe('.ms-selected');
        });
        expect($('.ms-selectable ul.ms-list li.ms-selected').length).toEqual(2);
      });
    });
  });

  describe('select', function(){
    describe("on click", function(){
      var clickedItem, value;

      beforeEach(function() {
        $('#multi-select').multiSelect();
        clickedItem = $('.ms-selectable ul.ms-list li').first();
        value = clickedItem.attr('id').replace('-selectable', '');
        spyOnEvent(select, 'change');
        spyOnEvent(select, 'focus');
        clickedItem.trigger('click');
      });

      it('should hide selected item', function(){
        expect(clickedItem).toBeHidden();
      });

      it('should add the .ms-selected class to the selected item', function(){
        expect(clickedItem.hasClass('ms-selected')).toBeTruthy();
      });

      it('should select corresponding option', function(){
        expect(select.find('option[value="'+value+'"]')).toBeSelected();
      });

      it('should show the associated selected item', function(){
        expect($('#'+value+'-selection')).toBe(':visible');
      });

      it('should trigger the original select change event', function(){
        expect('change').toHaveBeenTriggeredOn("#multi-select");
      });

      afterEach(function(){
        select.multiSelect('deselect_all');
      });
    });
  });

  describe('deselect', function(){
    describe("on click", function(){
      var clickedItem, value;
      var correspondingSelectableItem;

      beforeEach(function() {
        $('#multi-select').find('option').first().prop('selected', true);
        $('#multi-select').multiSelect();

        clickedItem = $('.ms-selection ul.ms-list li').first();
        value = clickedItem.attr('id').replace('-selection', '');
        correspondingSelectableItem = $('.ms-selection ul.ms-list li').first();
        spyOnEvent(select, 'change');
        spyOnEvent(select, 'focus');
        clickedItem.trigger('click');
      });

      it ('should hide clicked item', function(){
        expect(clickedItem).toBe(':hidden');
      });

      it('should show associated selectable item', function(){
        expect($('#'+value+'-selectable')).toBe(':visible');
      });

      it('should remove the .ms-selected class to the corresponding selectable item', function(){
        expect(correspondingSelectableItem.hasClass('ms-selected')).toBeFalsy();
      });

      it('should deselect corresponding option', function(){
        expect(select.find('option[value="'+value+'"]')).not.toBeSelected();
      });

      it('should trigger the original select change event', function(){
        expect('change').toHaveBeenTriggeredOn("#multi-select");
      });

      afterEach(function(){
        select.multiSelect('deselect_all');
      });
    });
  });
});