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
        
        ms.data('settings', multiSelects.settings);
        ms.children('option').each(function(){
          var selectableLi = $('<li ms-value="'+$(this).val()+'"></li>');
          
          selectableLi.html($(this).text());
          selectableLi.click(function(){
            ms.multiSelect('select', $(this).attr('ms-value'));
          });
          selectableUl.append(selectableLi);
        });
        selectableContainer.append(selectableUl);
        selectedContainer.append(selectedUl);
        container.append(selectableContainer);
        container.append(selectedContainer);
        ms.after(container);
        ms.children('option').each(function(){
          if($(this).attr('selected')){
            ms.multiSelect('select', $(this).val(), 'init');
          }
        });
      });
    },
    'select' : function(value, method){
      var ms = this;
      var msValues = (ms.val() ? ms.val() : []);
      var alreadyPresent = $.inArray(value, ms.val());
      
      if(alreadyPresent == -1 || method == 'init'){
        var option = ms.find('option[value="'+value+'"]');
        var selectedLi = $('<li ms-value="'+value+'"></li>');
        var newValues = $.merge(msValues, [value]);
        var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul');
        var selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');
        var selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
        var text = option.text();
        
        selectableLi.hide();
        ms.val(newValues);
        selectedLi.html(text);
        selectedLi.click(function(){
          ms.multiSelect('deselect', $(this).attr('ms-value'));
        });
        selectedUl.append(selectedLi);
        if (typeof ms.data('settings').afterSelect == 'function' && method != 'init') {
          ms.data('settings').afterSelect.call(this, value, text);
        }
      }
    },
    'deselect' : function(value){
      var ms = this;
      var msValues = (ms.val() ? ms.val() : []);
      var present = false;
      var newValues = $.map(msValues, function(e){ if(e != value){ return e; }else{ present = true}});
      
      if(present){
        var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul');
        var selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');
        var selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
        var selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
        var text = selectedLi.text();
        
        ms.val(newValues);
        selectableLi.show();
        selectedLi.remove();
        if (typeof ms.data('settings').afterDeselect == 'function') {
          ms.data('settings').afterDeselect.call(this, value, text);
        }
      }
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