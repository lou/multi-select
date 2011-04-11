(function($){
  
  var methods = {
    'init' : function(options){
      this.settings = {
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }
      
      var multiSelects = this;
      multiSelects.hide();
      
      multiSelects.each(function(){
        var ms = $(this);   
        var msId = 'ms-'+ms.attr('id');
        var container = $('<div id="'+msId+'" class="ms-container"></div>');
        var selectableContainer = $('<div class="ms-selectable"></div>');
        var selectedContainer = $('<div class="ms-selection"></div>');
        var selectableUl = $('<ul></ul>');
        var selectedUl = $('<ul></ul>');
        
        ms.children('option').each(function(){
          var selectableLi = $('<li ms-value="'+$(this).val()+'"></li>');
          
          selectableLi.html($(this).text());
          selectableLi.click(function(){
            ms.multiSelect('select', $(this).attr('ms-value'));
          });
          selectableUl.append(selectableLi);
        })
        selectableContainer.append(selectableUl);
        selectedContainer.append(selectedUl);
        container.append(selectableContainer);
        container.append(selectedContainer);
        ms.after(container);
        ms.children('option').each(function(){
          if($(this).attr('selected')){
            ms.multiSelect('select', $(this).val());
          }
        });
      });
    },
    'select' : function(value){
      var ms = this;
      var msValues = (ms.val() ? ms.val() : []);
      var option = ms.find('option[value="'+value+'"]');
      var selectedLi = $('<li ms-value="'+value+'"></li>');
      var newValues = $.merge(msValues, [value]);
      var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul');
      var selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');
      var selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
      
      selectableLi.hide();
      ms.val(newValues);
      selectedLi.html(option.text());
      selectedLi.click(function(){
        ms.multiSelect('deselect', $(this).attr('ms-value'));
      });
      selectedUl.append(selectedLi);

    },
    'deselect' : function(value){
      var ms = this;
      var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul');
      var selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');
      var selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
      var selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
      var newValues = $.map(ms.val(), function(e){ if(e != value){ return e; }});
      ms.val(newValues);
      selectableLi.show();
      selectedLi.remove();
    }
  }
  
  $.fn.multiSelect = function(method){
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      if(console.log) console.log( 'Method ' +  method + ' does not exist on jquery.multiSelect' );
    }
  }
})(jQuery);
