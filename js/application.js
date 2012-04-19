(function($){
  $(function(){

    $('.multiselect').multiSelect({});
    $('#ms-optgroup .ms-selectable, #ms-outsideCountries .ms-selectable').find('li.ms-elem-selectable').hide();
    $('.ms-optgroup-label').click(function(){
      if ($(this).hasClass('ms-collapse')){
        $(this).nextAll('li').hide();
        $(this).removeClass('ms-collapse'); 
      } else {
        $(this).nextAll('li:not(.ms-selected)').show();
        $(this).addClass('ms-collapse');
      }
    });
  
    $('#searchable-form').multiSelect({
      selectableHeader : '<input type="text" id="search" autocomplete = "off" />'
    });

    $('input#search').quicksearch('#ms-searchable-form .ms-selectable li');
    $('#searchable-form').multiSelect();
    

    $('#multipleHeaders').multiSelect({
      selectableHeader : '<h4>Selectable Items</h4>',
      selectedHeader : '<h4>Selected Items</h4>'
    });
    
    $('#simpleCountries').multiSelect({});

    $('#ikeeporder').multiSelect({ keepOrder: true });

    $('#empty-array-select').multiSelect({ emptyArray: true})
    
    $('#callbackCountries').multiSelect({
      afterSelect: function(value, text){
        alert('Select element\nvalue: '+value+'\ntext: '+text);
      },
      afterDeselect: function(value, text){
        alert('Deselect element\nvalue: '+value+'\ntext: '+text);
      }
    });
    
    $('#selectAll').click(function(){
      $('#outsideCountries').multiSelect('select_all');
      return false;
    });

    $('#deselectAll').click(function(){
      $('#outsideCountries').multiSelect('deselect_all');
      return false;
    });
    
    $('#selectFR').click(function(){
      $('#outsideCountries').multiSelect('select', 'fr');
      return false;
    });
    
    $('#deselectFR').click(function(){
      $('#outsideCountries').multiSelect('deselect', 'fr');
      return false;
    });
    
    
    $('#demos-menu li').click(function(){
      $('#demos-menu li').removeClass('active');
      $('#demos-content').children('div').hide();
      $(this).addClass('active');
      $('#demos-content .'+$(this).attr('id')).show();
    });
    
    $('#real-form').submit(function(){
      var value = $('#real-form').find('select').val();
      var str = value ? '['+value+']' : value;
      alert("select value:\n"+str);
      return false;
    });
    
    $('#empty-array-form').submit(function(){
      var value = $('#empty-array-form').find('select').val();
      var str = value ? '['+value+']' : value;
      alert("select value:\n"+str);
      return false;
    });
  });
})(jQuery)
