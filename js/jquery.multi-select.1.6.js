(function($){
  var msMethods = {
    
    
    'init' : function(options){
      this.settings = {
        disabledClass : 'disabled'
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }

      var multiSelects = this;
      multiSelects.hide();

      multiSelects.each(function(){
        var ms = $(this);

        ms.attr('id', ms.attr('id') ? ms.attr('id') : Math.ceil(Math.random()*1000));
        var container = $('<div id="ms-'+ms.attr('id')+'" class="ms-container"></div>'),
            selectableContainer = $('<div class="ms-selectable"></div>'),
            selectedContainer = $('<div class="ms-selection"></div>'),
            selectableUl = $('<ul></ul>'),
            selectedUl = $('<ul></ul>');
        
        if (ms.children("option[value='']").length == 0){
          ms.prepend("<option value=''></option>");
        }
        ms.data('settings', multiSelects.settings);
        ms.children("option:not(option[value=''])").each(function(){
          var selectableLi = $('<li ms-value="'+$(this).val()+'">'+$(this).text()+'</li>');
          
          if ($(this).prop('title'))
            selectableLi.prop('title', $(this).prop('title'));
          if ($(this).prop('disabled') || ms.prop('disabled')){
            selectableLi.prop('disabled', 'disabled');
            selectableLi.addClass(multiSelects.settings.disabledClass)
          }
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
          msValues = ((ms.val() && ms.val()[0] != '') ? ms.val() : []),
          alreadyPresent = $.inArray(value, msValues),
          text = ms.find('option[value="'+value+'"]').text(),
          titleAttr = ms.find('option[value="'+value+'"]').attr('title');

      if(alreadyPresent == -1 || method == 'init'){
        var selectedLi = $('<li ms-value="'+value+'">'+text+'</li>').detach(),
            newValues = $.merge(msValues, [value]),
            selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]');

        if (!selectableLi.prop('disabled')){
          selectableLi.hide();
          ms.val(newValues);
          if(titleAttr){
            selectedLi.prop('title', titleAttr)
          }
          selectedLi.click(function(){
            ms.multiSelect('deselect', $(this).attr('ms-value'));
          });
          selectedUl.append(selectedLi);
          if (typeof ms.data('settings').afterSelect == 'function' && method != 'init') {
            ms.data('settings').afterSelect.call(this, value, text);
          }
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
            selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
       
        if (newValues.length == 0){
          newValues = [''];
        }
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
      ms.children("option:not(option[value=''])").each(function(){
        ms.multiSelect('select', $(this).val(), 'select_all');
      });
    },
    'deselect_all' : function(){
      var ms = this;
      ms.children("option:not(option[value=''])").each(function(){
        ms.multiSelect('deselect', $(this).val(), 'deselect_all');
      });
    }
  };

  $.fn.multiSelect = function(method){
    if ( msMethods[method] ) {
      return msMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return msMethods.init.apply( this, arguments );
    } else {
      if(console.log) console.log( 'Method ' +  method + ' does not exist on jquery.multiSelect' );
    }
    return false;
  };
})(jQuery);