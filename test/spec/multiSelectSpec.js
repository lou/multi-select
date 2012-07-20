describe("multiSelect", function() {
  var select;
  var msContainer;

  beforeEach(function() {
    $('<select id="multi-select" multiple="multiple" name="test[]"></select>').appendTo('body');
    for (var i=1; i <= 10; i++) {
      $('<option value="value'+i+'">text'+i+'</option>').appendTo('#multi-select');
    };
    select = $("#multi-select");
    select.multiSelect();
    msContainer = select.next();
  });

  describe('init', function(){

    it('should hide the standard select', function(){
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

    it ('should not populate the selection list if none of the option is selected', function(){
      expect($('.ms-selection ul.ms-list li').length).toEqual(0);
    });


  });

  describe("When selectable item is clicked", function(){
    var clickedItem;

    beforeEach(function(){
      clickedItem = $('.ms-selectable ul.ms-list li').first();
      clickedItem.trigger('click');
    });

    it('should hide select item', function(){
      expect(clickedItem).toBeHidden();
    });

    it('should select corresponding option', function(){
      expect(select.children().first()).toBeSelected();
    });

    it('should populate the selection ul with the rigth item', function(){
      expect($('.ms-selection ul.ms-list li').first()).toBe('li.ms-elem-selected[ms-value="value1"]');
    });
  });

  afterEach(function () {
    $("#multi-select, .ms-container").remove();
  });

});