/*
* MultiSelect v0.6
* Copyright (c) 2012 Louis Cuny
*
* Dual licensed under the MIT and GPL licenses:
*    http://www.opensource.org/licenses/mit-license.php
*    http://www.gnu.org/licenses/gpl.html
*
*/

(function($){
  var msMethods = {
    'init' : function(options){
      this.settings = {
        disabledClass : 'disabled',
        callbackOnInit: false,
        keepOrder : false
      };
      if(options) {
        this.settings = $.extend(this.settings, options);
      }
      var multiSelects = this;
      multiSelects.css('position', 'absolute').css('left', '-9999px');
      multiSelects.each(function(){
        var ms = $(this);

        if (ms.next('.ms-container').length == 0){
          ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-'+Math.ceil(Math.random()*1000));
          var container = $('<div id="ms-'+ms.attr('id')+'" class="ms-container"></div>'),
              selectableContainer = $('<div class="ms-selectable"></div>'),
              selectedContainer = $('<div class="ms-selection"></div>'),
              selectableUl = $('<ul class="ms-list"></ul>'),
              selectedUl = $('<ul class="ms-list"></ul>');
          
          ms.data('settings', multiSelects.settings);

          var optgroupLabel = null,
              optgroupId = null,
              optgroupCpt = 0,
              scroll = 0;
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
              var klass = $(this).attr('class') ? ' '+$(this).attr('class') : '';
              var selectableLi = $('<li class="ms-elem-selectable'+klass+'" ms-value="'+$(this).val()+'">'+$(this).text()+'</li>');
            
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

          $('.ms-elem-selectable', container).on('mouseenter', function(){
            $('li', container).removeClass('ms-hover');
            $(this).addClass('ms-hover');
          }).on('mouseout', function(){
            $('li', container).removeClass('ms-hover');
          });



          selectableContainer.on('focusin', function(){
            $(this).addClass('ms-focused');
            selectedContainer.focusout();
          }).on('focusout', function(){
            $(this).removeClass('ms-focused');
            $('li', container).removeClass('ms-hover');
          });

          selectedContainer.on('focusin', function(){
            $(this).addClass('ms-focused');
            selectableContainer.focusout();
          }).on('focusout', function(){
            $(this).removeClass('ms-focused');
            $('li', container).removeClass('ms-hover');
          });

          ms.on('focusin', function(){
            ms.data('ms-focused', true);
            selectableContainer.focusin();

          }).on('focusout', function(){
            ms.data('ms-focused', null);
            selectableContainer.focusout();
          });

          ms.onKeyDown = function(e, keyContainer){
            var selectables = $('.'+keyContainer+' li:visible', container),
                selectablesLength = selectables.length,
                selectableFocused = $('.'+keyContainer+' li.ms-hover', container),
                selectableFocusedIndex = $('.'+keyContainer+' li:visible', container).index(selectableFocused),
                liHeight = selectables.first().outerHeight(),
                numberOfItemsDisplayed = Math.ceil(container.outerHeight()/liHeight),
                scrollStart = Math.ceil(numberOfItemsDisplayed/4);

            selectables.removeClass('ms-hover');
            if (e.keyCode == 32){ // space
              var method = keyContainer == 'ms-selectable' ? 'select' : 'deselect';
              ms.multiSelect(method, selectableFocused.first().attr('ms-value'));

            } else if (e.keyCode == 40){ // Down
              var nextIndex = (selectableFocusedIndex+1 != selectablesLength) ? selectableFocusedIndex+1 : 0,
                  nextSelectableLi = selectables.eq(nextIndex);

              nextSelectableLi.addClass('ms-hover');
              if (nextIndex > scrollStart){
                scroll += liHeight;
              } else if (nextIndex == 0){
                scroll = 0;
              }
              $('.'+keyContainer+' ul', container).scrollTop(scroll);
            } else if (e.keyCode == 38){ // Up
              var prevIndex = (selectableFocusedIndex-1 >= 0) ? selectableFocusedIndex-1 : selectablesLength-1,
                  prevSelectableLi = selectables.eq(prevIndex);
              selectables.removeClass('ms-hover');
              prevSelectableLi.addClass('ms-hover');
              if (selectablesLength-prevIndex+1 < scrollStart){
                scroll = liHeight*(selectablesLength-scrollStart);
              } else {
                scroll -= liHeight;
              }
              $('.'+keyContainer+' ul').scrollTop(scroll);
            } else if (e.keyCode == 37 || e.keyCode == 39){ // Right and Left
              if (selectableContainer.hasClass('ms-focused')){
                selectableContainer.focusout();
                selectedContainer.focusin();
              } else {
                selectableContainer.focusin();
                selectedContainer.focusout();
              }
            }
          }

          ms.on('keydown', function(e){
            if (ms.data('ms-focused')){
              var keyContainer = selectableContainer.hasClass('ms-focused') ? 'ms-selectable' : 'ms-selection';
              ms.onKeyDown(e, keyContainer);
            }
          });
        }
      });
    },
    'refresh' : function() {
      $("#ms-"+$(this).attr("id")).remove();
      $(this).multiSelect("init", $(this).data("settings"));
    },
    'select' : function(value, method){
      var ms = this,
          selectedOption = ms.find('option[value="'+value +'"]'),
          text = selectedOption.text(),
          klass = selectedOption.attr('class'),
          titleAttr = selectedOption.attr('title');

      var selectedLi = $('<li class="ms-elem-selected'+(klass ? ' '+klass : '')+'" ms-value="'+value+'">'+text+'</li>'),
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
          selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
          selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),  
          haveToSelect = null;

      if (method == 'init'){
        haveToSelect = !selectableLi.hasClass(ms.data('settings').disabledClass) && selectedOption.attr('selected');
      } else {
        haveToSelect = !selectableLi.hasClass(ms.data('settings').disabledClass);
      }
      if (haveToSelect && value && value != '' && selectedUl.children('li[ms-value="'+value+'"]').length == 0){
        ms.focus();
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
        if (selectableLi.hasClass(ms.data('settings').disabledClass)){
          selectedLi.addClass(ms.data('settings').disabledClass);
        } else {
          selectedLi.click(function(){
            ms.multiSelect('deselect', $(this).attr('ms-value'));
          });
        }

        var selectedUlLis = selectedUl.children('.ms-elem-selected');
        if (method != 'init' && ms.data('settings').keepOrder && selectedUlLis.length > 0) {

          var getIndexOf = function(value) {
            elems = selectableUl.children('.ms-elem-selectable');
            return(elems.index(elems.closest('[ms-value="'+value+'"]')));
          }
          
          var index = getIndexOf(selectedLi.attr('ms-value'));
          if (index == 0)
            selectedUl.prepend(selectedLi);
          else {
            for (i = index - 1; i >= 0; i--){
              if (selectedUlLis[i] && getIndexOf($(selectedUlLis[i]).attr('ms-value')) < index) {
                $(selectedUlLis[i]).after(selectedLi);
                break;
              } else if (i == 0) {
                $(selectedUlLis[i]).before(selectedLi);
              }
            }
          }
        } else {
          selectedUl.append(selectedLi);
        }
        selectedLi.on('mouseenter', function(){
          $('li', selectedUl).removeClass('ms-hover');
          $(this).addClass('ms-hover');
        }).on('mouseout', function(){
          $('li', selectedUl).removeClass('ms-hover');
        });
        if (ms.find("option[value='']")){
          ms.find("option[value='']").removeAttr('selected');
        }
        if (method == "select_all" && parentOptgroup.children('.ms-elem-selectable').length > 0){
          parentOptgroup.children('.ms-optgroup-label').hide();
        }
        if(method != 'init' || ms.data('settings').callbackOnInit){
          ms.trigger('change');
          selectedUl.trigger('change');
          selectableUl.trigger('change');
          if (typeof ms.data('settings').afterSelect == 'function' &&
              (method != 'init' || ms.data('settings').callbackOnInit)) {
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
        selectedUl.focusin();
        var selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul'),
            selectedUl = $('#ms-'+ms.attr('id')+' .ms-selection ul'),
            selectableLi = selectableUl.children('li[ms-value="'+value+'"]'),
            selectedLi = selectedUl.children('li[ms-value="'+value+'"]');
       
        var parentOptgroup = selectableLi.parent('.ms-optgroup');
        if (parentOptgroup.length > 0){
          parentOptgroup.children('.ms-optgroup-label').addClass('ms-collapse').show();
          parentOptgroup.children('.ms-elem-selectable:not(.ms-selected)').show();
        }
        selectedOption.removeAttr('selected');
        selectableLi.show();
        selectableLi.removeClass('ms-selected');
        selectedLi.remove();
        selectedUl.trigger('change');
        selectableUl.trigger('change');
        ms.trigger('change');
        if (typeof ms.data('settings').afterDeselect == 'function') {
          ms.data('settings').afterDeselect.call(this, value, selectedLi.text());
        }
      }
    },
    'select_all' : function(visible){
      var ms = this,
          selectableUl = $('#ms-'+ms.attr('id')+' .ms-selectable ul');

      ms.find("option:not(option[value=''])").each(function(){
        var value = $(this).val();
        if (visible){
          var selectableLi = selectableUl.children('li[ms-value="'+value+'"]');
          if (selectableLi.filter(':visible').length > 0){
            ms.multiSelect('select', value, 'select_all');
          }
        } else {
          ms.multiSelect('select', value, 'select_all'); 
        }
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
