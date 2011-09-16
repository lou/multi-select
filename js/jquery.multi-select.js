(function($){
  var msMethods = {
    'init' : function(options){
      this.settings = {
        disabledClass : 'disabled',
        emptyArray : false
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }

      var multiSelects = this;
      multiSelects.hide();

      multiSelects.each(function(){
        var ms = $(this);

        if (ms.next('.ms-container').length == 0){
          ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-'+Math.ceil(Math.random()*1000));
          var container = $('<div id="ms-'+ms.attr('id')+'" class="ms-container"></div>'),
              selectableContainer = $('<div class="ms-selectable"></div>'),
              selectedContainer = $('<div class="ms-selection"></div>'),
              selectableUl = $('<ul class="ms-list"></ul>'),
              selectedUl = $('<ul class="ms-list"></ul>');
          
          if (multiSelects.settings.emptyArray){
            if (ms.find("option[value='']").length == 0){
              ms.prepend("<option value='' selected='selected'></option>");
            } else {
              ms.find("option[value='']").attr('selected', 'selected');
            }
          }
          ms.data('settings', multiSelects.settings);

          var optgroupLabel = null,
              optgroupId = null,
              optgroupCpt = 0;
          ms.find('optgroup,option').each(function(){
            if ($(this).is('optgroup')){
              optgroupLabel = $(this).attr('label');
              optgroupId = 'ms-'+ms.attr('id')+'-optgroup-'+optgroupCpt;
              selectableUl.append($('<li class="ms-optgroup-container" id="'+
                                  optgroupId+'"><ul class="ms-optgroup"><li class="ms-optgroup-label">'+
                                  optgroupLabel+'</li></ul></li>'));
              optgroupCpt++;
            }
            if ($(this).is("option:not(option[value=''])")){
              var selectableLi = $('<li class="ms-elem-selectable" ms-value="'+$(this).val()+'">'+$(this).text()+'</li>');
            
              if ($(this).attr('title'))
                selectableLi.attr('title', $(this).attr('title'));
              if ($(this).attr('disabled') || ms.attr('disabled')){
                selectableLi.attr('disabled', 'disabled');
                selectableLi.addClass(multiSelects.settings.disabledClass);
              }
              selectableLi.click(function(){
                ms.multiSelect('select', $(this).attr('ms-value'));
              });
              var container = optgroupId ? selectableUl.children('#'+optgroupId).find('ul').first() : selectableUl;
              container.append(selectableLi);
            }
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
          ms.find('option:selected').each(function(){
            ms.multiSelect('select', $(this).val(), 'init');
          });
        }
      });
    },
    'refresh' : function() {
      $("#ms-"+$(this).attr("id")).remove();
      $(this).multiSelect("init");
    },
    'select' : function(value, method){
      var ms = this,
          selectedOption = ms.find('option[value="'+value +'"]'),
          text = selectedOption.text(),
          titleAttr = selectedOption.attr('title');
      
        var selectedLi = $('<li class="ms-elem-selected" ms-value="'+value+'">'+text+'</li>'),
            selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),        
            haveToSelect =  !selectableLi.hasClass(ms.data('settings').disabledClass) && value != '' &&
                            ((method == 'init' && selectedOption.attr('selected')) ||
                              (method != 'init' && !selectedOption.attr('selected')))

        if (haveToSelect ){
          var parentOptgroup = selectableLi.parent('.ms-optgroup');
          if (parentOptgroup.length > 0)
            if (parentOptgroup.children('.ms-elem-selectable:not(:hidden)').length == 1)
              parentOptgroup.children('.ms-optgroup-label').hide();
          selectableLi.addClass('ms-selected');
          selectableLi.hide();
          selectedOption.attr('selected', 'selected');
          if(titleAttr){
            selectedLi.attr('title', titleAttr)
          }
          selectedLi.click(function(){
            ms.multiSelect('deselect', $(this).attr('ms-value'));
          });
          selectedUl.append(selectedLi);
          if (ms.find("option[value='']")){
            ms.find("option[value='']").removeAttr('selected');
          }
          if(method != 'init'){
            selectedUl.trigger('change');
            selectableUl.trigger('change');
            if (typeof ms.data('settings').afterSelect == 'function' && method != 'init') {
              ms.data('settings').afterSelect.call(this, value, text);
            }
        }
      }
    },
    'deselect' : function(value){
      var ms = this,
          selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
          selectedOption = ms.find('option[value="'+value +'"]'),
          selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
      
      if(selectedLi){
        var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),
            selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
       
        var parentOptgroup = selectableLi.parent('.ms-optgroup');
        if (parentOptgroup.length > 0)
          parentOptgroup.children('.ms-optgroup-label').show();
        selectedOption.removeAttr('selected');
        selectableLi.show();
        selectableLi.removeClass('ms-selected');
        selectedLi.remove();
        if (ms.data('settings').emptyArray && selectedUl.children('li').length == 0){
          if (ms.find("option[value='']")){
            ms.find("option[value='']").attr('selected', 'selected');
          }
        }
        selectedUl.trigger('change');
        selectableUl.trigger('change');
        if (typeof ms.data('settings').afterDeselect == 'function') {
          ms.data('settings').afterDeselect.call(this, value, selectedLi.text());
        }
      }
    },
    'select_all' : function(){
      var ms = this;
      ms.find("option:not(option[value=''])").each(function(){
        ms.multiSelect('select', $(this).val(), 'select_all');
      });
    },
    'deselect_all' : function(){
      var ms = this;
      ms.find("option:not(option[value=''])").each(function(){
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