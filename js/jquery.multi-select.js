(function($){
  
  var msMethods = {
    'init' : function(options){
      this.settings = {
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }
      
      var multiSelects = this;
      multiSelects.hide();
      
      multiSelects.each(function(){
        var ms = $(this),
            container = $('<div id="ms-'+ms.attr('id')+'" class="ms-container"></div>').detach(),
            selectableContainer = $('<div class="ms-selectable"></div>').detach(),
            selectedContainer = $('<div class="ms-selection"></div>').detach(),
            selectableUl = $('<ul></ul>').detach(),
            selectedUl = $('<ul></ul>').detach();
        
        ms.data('settings', multiSelects.settings);
        ms.children('option').each(function(){
          var selectableLi = $('<li ms-value="'+$(this).val()+'">'+$(this).text()+'</li>').detach();
          
          selectableLi.click(function(){
            ms.multiSelect('select', $(this).attr('ms-value'));
          });
          selectableUl.append(selectableLi);
        });
        if (multiSelects.settings.selectableHeader){
          selectableContainer.append(multiSelects.settings.selectableHeader);
        }
        selectableContainer.append(selectableUl);
        if (multiSelects.settings.selectedHeader){
          selectedContainer.append(multiSelects.settings.selectedHeader);
        }
        selectedContainer.append(selectedUl);
        container.append(selectableContainer);
        container.append(selectedContainer);
        ms.after(container);
        ms.children('option:selected').each(function(){
          ms.multiSelect('select', $(this).val(), 'init');
        });
      });
    },
    'select' : function(value, method){
      var ms = this,
          msValues = (ms.val() ? ms.val() : []),
          alreadyPresent = $.inArray(value, msValues),
          text = ms.find('option[value="'+value+'"]').text();
      
      if(alreadyPresent == -1 || method == 'init'){
        var selectedLi = $('<li ms-value="'+value+'">'+text+'</li>').detach(),
            newValues = $.merge(msValues, [value]),
            selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
        
        selectableLi.hide();
        ms.val(newValues);
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
      var ms = this,
          msValues = (ms.val() ? ms.val() : []),
          present = false,
          newValues = $.map(msValues, function(e){ if(e != value){ return e; }else{ present = true}});
      
      if(present){
        var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),
            selectedLi = selectedUl.children('li[ms-value="'+value+'"]').detach();
        
        ms.val(newValues);
        selectableLi.show();
        selectedLi.remove();
        if (typeof ms.data('settings').afterDeselect == 'function') {
          ms.data('settings').afterDeselect.call(this, value, selectedLi.text());
        }
      }
    },
    'select_all' : function(){
      var ms = this;
      ms.children('option').each(function(){
        ms.multiSelect('select', $(this).val(), 'select_all');
      });
    },
    'deselect_all' :function(){
      var ms = this;
      ms.children('option').each(function(){
        ms.multiSelect('deselect', $(this).val(), 'deselect_all');
      });
    }
  }
  
  $.fn.multiSelect = function(method){
    if ( msMethods[method] ) {
      return msMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return msMethods.init.apply( this, arguments );
    } else {
      if(console.log) console.log( 'Method ' +  method + ' does not exist on jquery.multiSelect' );
    }
  }
})(jQuery);