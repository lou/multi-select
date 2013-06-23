// Put your application scripts here
(function($){
  $(function(){
    
    $('.multiselect').multiSelect({});

    $('#keep-order').multiSelect({
      keepOrder: true
    });

    $('#searchable').multiSelect({
      selectableHeader: "<input type='text' id='search1' autocomplete='off' placeholder='try \"elem 2\"'>",
      selectionHeader: "<input type='text' id='search2' autocomplete='off' placeholder='try \"elem 2\"'>"
    });

    $('#search1').quicksearch($('.ms-elem-selectable', '#ms-searchable' )).on('keydown', function(e){
      if (e.keyCode == 40){
        $('#searchable').focus();
        return false;
      }
    });

    $('#search2').quicksearch($('.ms-elem-selection', '#ms-searchable' )).on('keydown', function(e){
      if (e.keyCode == 40){
        $('#ms-searchable').children('.ms-selection').find('.ms-list').focus();
        return false;
      }
    });

    
    $('#optgroup').multiSelect({
      selectableOptgroup: true
    });


    $('#custom-headers').multiSelect({
      selectableHeader: "<div class='custom-header'>Selectable item</div>",
      selectionHeader: "<div class='custom-header'>Selection items</div>",
      selectableFooter: "<div class='custom-header'>Selectable Footer</div>",
      selectionFooter: "<div class='custom-header'>Selection Footer</div>"
    });

    $('#callbacks').multiSelect({
      afterSelect: function(values){
        alert("Select value: "+values);
      },
      afterDeselect: function(values){
        alert("Deselect value: "+values);
      }
    });

    $('#refresh').on('click', function(){
      $('#public-methods').multiSelect('refresh');
      return false;
    })

    $('#public-methods').multiSelect({});
    
    $('#select-all').click(function(){
      $('#public-methods').multiSelect('select_all');
      return false;
    });
    $('#deselect-all').click(function(){
      $('#public-methods').multiSelect('deselect_all');
      return false;
    });

    var arr = [];

    for (var i = 0; i < 100; i++){
      arr[i] = 'elem_'+(i+1);
    }

    $('#select-100').click(function(){
      $('#public-methods').multiSelect('select', arr);
      return false;
    });
    $('#deselect-100').click(function(){
      $('#public-methods').multiSelect('deselect', arr);
      return false;
    }); 
  });
})(jQuery);