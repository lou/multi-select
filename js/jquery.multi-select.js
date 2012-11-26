/*
* MultiSelect v0.9
* Copyright (c) 2012 Louis Cuny
*
* This program is free software. It comes without any warranty, to
* the extent permitted by applicable law. You can redistribute it
* and/or modify it under the terms of the Do What The Fuck You Want
* To Public License, Version 2, as published by Sam Hocevar. See
* http://sam.zoy.org/wtfpl/COPYING for more details.
*/

(function($){
  var msMethods = {
    'init' : function(options){
      this.settings = {
        disabledClass : 'disabled',
        dblClick : false
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }
      var multiSelects = this;
      multiSelects.css('position', 'absolute').css('left', '-9999px');
      return multiSelects.each(function(){
        var ms = $(this),
            container,
            selectableContainer,
            selectionContainer,
            selectableUl,
            selectionUl;

        if (ms.next('.ms-container').length == 0){
          ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-'+Math.ceil(Math.random()*1000));
          container = $('<div id="ms-'+ms.attr('id')+'" class="ms-container"></div>'),
          selectableContainer = $('<div class="ms-selectable"></div>'),
          selectionContainer = $('<div class="ms-selection"></div>'),
          selectableUl = $('<ul class="ms-list"></ul>'),
          selectionUl = $('<ul class="ms-list"></ul>');

          ms.data('settings', multiSelects.settings);

          var optgroupLabel = null,
              optgroupId = null,
              optgroupCpt = 0,
              scroll = 0;

          ms.find('optgroup, option').each(function(){
            if ($(this).is('optgroup')){
              optgroupLabel = $(this).attr('label');
              optgroupId = 'ms-'+ms.attr('id')+'-optgroup-'+optgroupCpt;
              var optgroupContainerTpl = '<li class="ms-optgroup-container" id="'+
                  optgroupId+'"><ul class="ms-optgroup"><li class="ms-optgroup-label">'+
                  optgroupLabel+'</li></ul></li>';

              selectableUl.append($(optgroupContainerTpl));
              selectionUl.append($(optgroupContainerTpl));
              optgroupCpt++;
            } else {
              var klass = $(this).attr('class') ? $(this).attr('class') : '',
                  title = $(this).attr('title') ? $(this).attr('title') : '',
                  value = $(this).val(),
                  text = $(this).text(),
                  selectableLi = $('<li class="'+klass+'" ms-value="'+value+'" title="'+title+'">'+text+'</li>'),
                  selectedLi = $('<li class="'+klass+'" ms-value="'+value+'" title="'+title+'">'+text+'</li>');

              selectableLi.addClass('ms-elem-selectable');
              selectedLi.addClass('ms-elem-selection').hide();
              selectionUl.find('.ms-optgroup').hide();

              if ($(this).attr('disabled') || ms.attr('disabled')){
                selectableLi.prop('disabled', true);
                selectableLi.addClass(multiSelects.settings.disabledClass);
              }

              if(multiSelects.settings.dblClick) {
                selectableLi.dblclick(function(){
                  ms.multiSelect('select', $(this).attr('ms-value'));
                });
                selectedLi.dblclick(function(){
                  ms.multiSelect('deselect', $(this).attr('ms-value'));
                });
              } else {
                selectableLi.click(function(){
                  ms.multiSelect('select', $(this).attr('ms-value'));
                });
                selectedLi.click(function(){
                  ms.multiSelect('deselect', $(this).attr('ms-value'));
                });
              }

              var selectableElemContainer, selectedElemContainer;

              if (optgroupId){
                selectableElemContainer = selectableUl.children('#'+optgroupId).find('ul').first();
                selectedElemContainer = selectionUl.children('#'+optgroupId).find('ul').first();
              } else {
                selectableElemContainer = selectableUl;
                selectedElemContainer = selectionUl;
              }

              selectableElemContainer.append(selectableLi);
              selectedElemContainer.append(selectedLi);
            }
          });
          if (multiSelects.settings.selectableHeader){
            selectableContainer.append(multiSelects.settings.selectableHeader);
          }
          selectableContainer.append(selectableUl);
          if (multiSelects.settings.selectedHeader){
            selectionContainer.append(multiSelects.settings.selectedHeader);
          }
          selectionContainer.append(selectionUl);
          container.append(selectableContainer);
          container.append(selectionContainer);
          ms.after(container);
          ms.find('option:selected').each(function(){
            ms.multiSelect('select', $(this).val(), 'init');
          });

          $('.ms-elem-selectable', selectableUl).on('mouseenter', function(){
            $('li', container).removeClass('ms-hover');
            $(this).addClass('ms-hover');
          }).on('mouseout', function(){
            $('li', container).removeClass('ms-hover');
          });

          $('.ms-elem-selection', selectionUl).on('mouseenter', function(){
            $('li', selectionUl).removeClass('ms-hover');
            $(this).addClass('ms-hover');
          }).on('mouseout', function(){
            $('li', selectionUl).removeClass('ms-hover');
          });

          selectableUl.on('focusin', function(){
            $(this).addClass('ms-focus');
            selectionUl.focusout();
          }).on('focusout', function(){
            $(this).removeClass('ms-focus');
            $('li', container).removeClass('ms-hover');
          });

          selectionUl.on('focusin', function(){
            $(this).addClass('ms-focus');
          }).on('focusout', function(){
            $(this).removeClass('ms-focus');
            $('li', container).removeClass('ms-hover');
          });

          ms.on('focusin', function(){
            selectableUl.focus();
          }).on('focusout', function(){
            selectableUl.removeClass('ms-focus');
            selectionUl.removeClass('ms-focus');
          });

          // ms.onKeyDown = function(e, keyContainer){
          //   var selectables = $('.'+keyContainer+' li:visible:not(.ms-optgroup-label, .ms-optgroup-container)', container),
          //       selectablesLength = selectables.length,
          //       selectableFocused = $('.'+keyContainer+' li.ms-hover', container),
          //       selectableFocusedIndex = $('.'+keyContainer+' li:visible:not(.ms-optgroup-label, .ms-optgroup-container)', container).index(selectableFocused),
          //       liHeight = selectables.first().outerHeight(),
          //       numberOfItemsDisplayed = Math.ceil(container.outerHeight()/liHeight),
          //       scrollStart = Math.ceil(numberOfItemsDisplayed/4);

          //   selectables.removeClass('ms-hover');
          //   if (e.keyCode == 32){ // space
          //     var method = keyContainer == 'ms-selectable' ? 'select' : 'deselect';
          //     ms.multiSelect(method, selectableFocused.first().attr('ms-value'));

          //   } else if (e.keyCode == 40){ // Down
          //     var nextIndex = (selectableFocusedIndex+1 != selectablesLength) ? selectableFocusedIndex+1 : 0,
          //         nextSelectableLi = selectables.eq(nextIndex);

          //     nextSelectableLi.addClass('ms-hover');
          //     if (nextIndex > scrollStart){
          //       scroll += liHeight;
          //     } else if (nextIndex == 0){
          //       scroll = 0;
          //     }
          //     $('.'+keyContainer+' ul', container).scrollTop(scroll);
          //   } else if (e.keyCode == 38){ // Up
          //     var prevIndex = (selectableFocusedIndex-1 >= 0) ? selectableFocusedIndex-1 : selectablesLength-1,
          //         prevSelectableLi = selectables.eq(prevIndex);
          //     selectables.removeClass('ms-hover');
          //     prevSelectableLi.addClass('ms-hover');
          //     if (selectablesLength-prevIndex+1 < scrollStart){
          //       scroll = liHeight*(selectablesLength-scrollStart);
          //     } else {
          //       scroll -= liHeight;
          //     }
          //     $('.'+keyContainer+' ul', container).scrollTop(scroll);
          //   } else if (e.keyCode == 37 || e.keyCode == 39){ // Right and Left
          //     if (selectableUl.hasClass('ms-focus')){
          //       selectableUl.focusout();
          //       selectionUl.focusin();
          //     } else {
          //       selectableUl.focusin();
          //       selectionUl.focusout();
          //     }
          //   }
          // }

          // ms.on('keydown', function(e){
          //   if (ms.is(':focus')){
          //     var keyContainer = selectableUl.hasClass('ms-focus') ? 'ms-selectable' : 'ms-selection';
          //     ms.onKeyDown(e, keyContainer);
          //   }
          // });
        }
      });
    },
    'refresh' : function() {
      $("#ms-"+$(this).attr("id")).remove();
      $(this).multiSelect("init", $(this).data("settings"));
    },
    'select' : function(value, method){
      var ms = this,
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
          selectionUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');

      if (typeof value == 'string'){
        var selectedOption = ms.find('option[value="'+value +'"]'),
            selectedLi = selectionUl.children('li[ms-value="'+value+'"]'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]');

        if (method == 'init'){
          haveToSelect = !selectableLi.hasClass(ms.data('settings').disabledClass) && selectedOption.prop('selected');
        } else {
          haveToSelect = !selectableLi.hasClass(ms.data('settings').disabledClass);
          ms.focus();
        }

        if (haveToSelect && selectedLi.is(':hidden')){

          var selectableOptgroup = selectableLi.parent('.ms-optgroup');
          if (selectableOptgroup.length > 0)
            if (selectableOptgroup.children('.ms-elem-selectable:not(:hidden)').length == 1)
              selectableOptgroup.children('.ms-optgroup-label').hide();

          if (selectedLi.parent('.ms-optgroup').length > 0){
            selectedLi.parent('.ms-optgroup').show();
          }

          selectedOption.prop('selected', true);
          selectableLi.addClass('ms-selected');
          selectableLi.hide(); 
          selectedLi.show();
          if (method != 'init'){
            ms.trigger('change');
            if (typeof ms.data('settings').afterSelect == 'function') {
              ms.data('settings').afterSelect.call(this, value, selectedOption.text());
            }
          }
        }
      } else if (typeof value == 'object'){ // Is an array
        for (var cpt = 0; cpt < value.length; cpt++){
          var selectedOption = ms.find('option[value="'+value[cpt]+'"]'),
            selectedLi = selectionUl.children('li[ms-value="'+value[cpt]+'"]'),
            selectableLi = selectableUl.children('li[ms-value="'+value[cpt]+'"]');
          selectedOption.prop('selected', true);
          selectableLi.addClass('ms-selected');
          selectableLi.hide();
          selectedLi.show();       
        }
      }
    },
    'deselect' : function(value){
      var ms = this,
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
          selectionUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
          selectedOption = ms.find('option[value="'+value +'"]'),
          selectedLi = selectionUl.children('li[ms-value="'+value+'"]');

      if (selectedLi){
        selectionUl.focusin();
        var selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),
            selectedLi = selectionUl.children('li[ms-value="'+value+'"]');

        var selectableOptgroup = selectableLi.parent('.ms-optgroup');
        if (selectableOptgroup.length > 0){
          selectableOptgroup.children('.ms-optgroup-label').addClass('ms-collapse').show();
          selectableOptgroup.children('.ms-elem-selectable:not(.ms-selected)').show();
        }

        selectedOption.prop('selected', false);
        selectableLi.show();
        selectableLi.removeClass('ms-selected');
        selectedLi.hide();

        var selectionOptgroup = selectedLi.parent('.ms-optgroup');
        
        if (selectionOptgroup.children(':visible').length == 1){
          selectionOptgroup.hide(); 
        }

        ms.trigger('change');
        
        if (typeof ms.data('settings').afterDeselect == 'function') {
          ms.data('settings').afterDeselect.call(this, value, selectedLi.text());
        }
      }
    },
    'select_all' : function(visible){
      var ms = this,
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
          selectionUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');

      ms.find('option').prop('selected', true);
      selectableUl.find('.ms-elem-selectable').addClass('ms-selected').hide();
      selectionUl.find('.ms-elem-selection').show();
    },
    'deselect_all' : function(){
      var ms = this,
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
          selectionUl = $('#ms-'+ms.attr('id')+' .ms-selection ul');

      ms.find('option').prop('selected', false);
      selectableUl.find('.ms-elem-selectable').removeClass('ms-selected').show();
      selectionUl.find('.ms-elem-selection').hide();
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