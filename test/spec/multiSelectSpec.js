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
          expect($('.ms-selectable ul.ms-list li#'+sanitize(value)+'-selectable')).toBe('.ms-selected');
        });
        expect($('.ms-selectable ul.ms-list li.ms-selected').length).toEqual(2);
      });
    });

    describe("with disabled pre-selected options", function(){
      var selectedValues = ['value1', 'value2', 'value3'];

      beforeEach(function() {
        $('#multi-select').find('option')
          .first().prop('selected', true).prop('disabled', true)
          .next().prop('selected', true)
          .next().prop('selected', true).prop('disabled', true)
        ;
        $('#multi-select').multiSelect();
      })

      it ('should select the disabled pre-selected options', function(){
        $.each(selectedValues, function(index, value){
          expect($('.ms-selectable ul.ms-list li#'+sanitize(value)+'-selectable')).toBe('.ms-selected');
        });
        expect($('.ms-selectable ul.ms-list li.ms-selected').length).toEqual(3);
      });
    });

    describe("with disabled non-selected options", function(){
      var selectedValues = ['value1', 'value3'];

      beforeEach(function() {
        $('#multi-select').find('option')
          .first().prop('selected', true)
          .next().prop('disabled', true)
          .next().prop('selected', true)
        ;
        $('#multi-select').multiSelect();
      })

      it ('should not select the disabled non-selected options', function(){
        $.each(selectedValues, function(index, value){
          expect($('.ms-selectable ul.ms-list li#'+sanitize(value)+'-selectable')).toBe('.ms-selected');
        });
        expect($('.ms-selectable ul.ms-list li.ms-selected').length).toEqual(2);
      });
    });
  });

  describe('destroy', function(){

    describe('destroy multi select', function(){
      beforeEach(function(){
        select.multiSelect();
        msContainer = select.next();
        select.multiSelect('destroy');
      });

      it('should show the original select', function(){
        expect(select.css('position')).not.toBe('absolute');
        expect(select.css('left')).not.toBe('-9999px');
      });

      it('should destroy the multiSelect container', function(){
        expect(select.next().size()).toEqual(0);
      });
    });
  });

  describe('optgroup', function(){
    var optgroupMsContainer, optgroupSelect, optgroupLabels;

    beforeEach(function() {
      $('<select id="multi-select-optgroup" multiple="multiple" name="testy[]"></select>').appendTo('body');
      for (var o=1; o <= 10; o++) {
        var optgroup = $('<optgroup label="opgroup'+o+'"></optgroup>')
        for (var i=1; i <= 10; i++) {
          var value = i + (o * 10);
          $('<option value="value'+value+'">text'+value+'</option>').appendTo(optgroup);
        };
        optgroup.appendTo($("#multi-select-optgroup"));
      }
      optgroupSelect = $("#multi-select-optgroup");
    });

    describe('init', function(){
      describe('with selectableOptgroup option set to false', function(){
        beforeEach(function(){
          optgroupSelect.multiSelect({ selectableOptgroup: false });
          optgroupMsContainer = optgroupSelect.next();
          optgroupLabels = optgroupMsContainer.find('.ms-selectable .ms-optgroup-label');
        });

        it ('sould display all optgroups', function(){
          expect(optgroupLabels.length).toEqual(10);
        });

        it ('should do nothing when clicking on optgroup', function(){
          var clickedOptGroupLabel = optgroupLabels.first();
          clickedOptGroupLabel.trigger('click');
          expect(optgroupSelect.val()).toBeNull();
        });
      });

      describe('with selectableOptgroup option set to true', function(){
        beforeEach(function(){
          optgroupSelect.multiSelect({ selectableOptgroup: true });
          optgroupMsContainer = optgroupSelect.next();
          optgroupLabels = optgroupMsContainer.find('.ms-selectable .ms-optgroup-label');
        });

        it ('should select all nested options when clicking on optgroup', function(){
          var clickedOptGroupLabel = optgroupLabels.first();
          clickedOptGroupLabel.trigger('click');
          expect(optgroupSelect.val().length).toBe(10);
        });
      });
    });

  });

  describe('select', function(){

    describe('multiple values (Array)', function(){
      var values = ['value1', 'value2', 'value7'];
      beforeEach(function(){
        $('#multi-select').multiSelect();
        $('#multi-select').multiSelect('select', values);
      });
      
      it('should select corresponding option', function(){
        expect(select.val()).toEqual(values);
      });
    });

    describe('single value (String)', function(){
      var value = 'value1';

      beforeEach(function(){
        $('#multi-select').multiSelect();
        $('#multi-select').multiSelect('select', value);
      });

      it('should select corresponding option', function(){
        expect($.inArray(value, select.val()) > -1).toBeTruthy();
      });
    });

    describe("on click", function(){
      var clickedItem, value;

      beforeEach(function() {
        $('#multi-select').multiSelect();
        clickedItem = $('.ms-selectable ul.ms-list li').first();
        value = clickedItem.data('ms-value');
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
        expect($('#'+sanitize(value)+'-selection')).toBe(':visible');
      });

      it('should trigger the original select change event', function(){
        expect('change').toHaveBeenTriggeredOn("#multi-select");
      });

      afterEach(function(){
        select.multiSelect('deselect_all');
      });
    });

    describe("on click on disabled non-selected option", function(){
      var clickedItem, value;

      beforeEach(function() {
        $('#multi-select').find('option').first().prop('disabled', true);
        $('#multi-select').multiSelect();
        clickedItem = $('.ms-selectable ul.ms-list li').first();
        value = clickedItem.data('ms-value');
        spyOnEvent(select, 'change');
        spyOnEvent(select, 'focus');
        clickedItem.trigger('click');
      });

      it('should not hide selected item', function(){
        expect(clickedItem).not.toBeHidden();
      });

      it('should not add the .ms-selected class to the selected item', function(){
        expect(clickedItem.hasClass('ms-selected')).not.toBeTruthy();
      });

      it('should not select corresponding option', function(){
        expect(select.find('option[value="'+value+'"]')).not.toBeSelected();
      });

      it('should not show the associated selected item', function(){
        expect($('#'+sanitize(value)+'-selection')).not.toBe(':visible');
      });

      it('should not trigger the original select change event', function(){
        expect('change').not.toHaveBeenTriggeredOn("#multi-select");
      });

      afterEach(function(){
        select.multiSelect('deselect_all');
      });
    });
  });

  describe('deselect', function(){
    describe('multiple values (Array)', function(){
      var selectedValues = ['value1', 'value2', 'value7'],
          deselectValues = ['value1', 'value2'];
      beforeEach(function(){
        $('#multi-select').multiSelect();
        $('#multi-select').multiSelect('select', selectedValues);
        $('#multi-select').multiSelect('deselect', deselectValues);
      });
      
      it('should select corresponding option', function(){
        expect(select.val()).toEqual(['value7']);
      });
    });

    describe('single value (String)', function(){
      var selectedValues = ['value1', 'value2', 'value7'],
          deselectValue = 'value2';

      beforeEach(function(){
        $('#multi-select').multiSelect();
        $('#multi-select').multiSelect('select', selectedValues);
        $('#multi-select').multiSelect('deselect', deselectValue);
      });

      it('should select corresponding option', function(){
        expect($.inArray(deselectValue, select.val()) > -1).toBeFalsy();
      });
    });

    describe("on click", function(){
      var clickedItem, value;
      var correspondingSelectableItem;

      beforeEach(function() {
        $('#multi-select').find('option').first().prop('selected', true);
        $('#multi-select').multiSelect();

        clickedItem = $('.ms-selection ul.ms-list li').first();
        value = clickedItem.data('ms-value');
        correspondingSelectableItem = $('.ms-selection ul.ms-list li').first();
        spyOnEvent(select, 'change');
        spyOnEvent(select, 'focus');
        clickedItem.trigger('click');
      });

      it ('should hide clicked item', function(){
        expect(clickedItem).toBe(':hidden');
      });

      it('should show associated selectable item', function(){
        expect($('#'+sanitize(value)+'-selectable')).toBe(':visible');
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

    describe("on click on disabled selected option", function(){
      var clickedItem, value;
      var correspondingSelectableItem;

      beforeEach(function() {
        $('#multi-select').find('option').first().prop('selected', true).prop('disabled', true);
        $('#multi-select').multiSelect();

        clickedItem = $('.ms-selection ul.ms-list li').first();
        value = clickedItem.data('ms-value');
        correspondingSelectableItem = $('.ms-selection ul.ms-list li').first();
        spyOnEvent(select, 'change');
        spyOnEvent(select, 'focus');
        clickedItem.trigger('click');
      });

      it ('should not hide clicked item', function(){
        expect(clickedItem).not.toBe(':hidden');
      });

      it('should not show associated selectable item', function(){
        expect($('#'+value+'-selectable')).not.toBe(':visible');
      });

      it('should not remove the .ms-selected class to the corresponding selectable item', function(){
        expect(correspondingSelectableItem.hasClass('ms-selected')).not.toBeFalsy();
      });

      it('should not deselect corresponding option', function(){
        expect(select.find('option[value="'+value+'"]')).toBeSelected();
      });

      it('should not trigger the original select change event', function(){
        expect('change').not.toHaveBeenTriggeredOn("#multi-select");
      });

      afterEach(function(){
        select.multiSelect('deselect_all');
      });
    });
  });
});
