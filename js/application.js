// Put your application scripts here
(function($){
  $(function(){
    $('#aloha').multiSelect({
      keepOrder: true
    });
    $('.multiselect').multiSelect({});

    $('.searchable').multiSelect({
      selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='try \"12\"'>",
      selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='try \"4\"'>",
      afterInit: function(ms){
        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
        .on('keydown', function(e){
          if (e.which === 40){
            that.$selectableUl.focus();
            return false;
          }
        });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
        .on('keydown', function(e){
          if (e.which == 40){
            that.$selectionUl.focus();
            return false;
          }
        });
      },
      afterSelect: function(){
        this.qs1.cache();
        this.qs2.cache();
      },
      afterDeselect: function(){
        this.qs1.cache();
        this.qs2.cache();
      }
    });


    $('#keep-order').multiSelect({
      keepOrder: true
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
    });

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

    $('#add-option').on('click', function(){
      $('#public-methods').multiSelect('addOption', { value: 42, text: 'test 42', index: 0 });
      return false;
    });

  });
})(jQuery);
