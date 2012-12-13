/*
* MultiSelect v0.9.1
* Copyright (c) 2012 Louis Cuny
*
* This program is free software. It comes without any warranty, to
* the extent permitted by applicable law. You can redistribute it
* and/or modify it under the terms of the Do What The Fuck You Want
* To Public License, Version 2, as published by Sam Hocevar. See
* http://sam.zoy.org/wtfpl/COPYING for more details.
*/

!function ($) {

  "use strict"; // jshint ;_;


 /* MULTISELECT CLASS DEFINITION
  * ====================== */

  var MultiSelect = function (element, options) {
    this.options = options;
    this.$element = $(element);
    this.$container = $('<div id="ms-'+this.$element.attr('id')+'" class="ms-container"></div>');
    this.$selectableContainer = $('<div class="ms-selectable"></div>');
    this.$selectionContainer = $('<div class="ms-selection"></div>');
    this.$selectableUl = $('<ul class="ms-list"></ul>');
    this.$selectionUl = $('<ul class="ms-list"></ul>');
    this.scrollTo = 0;
  }

  MultiSelect.prototype = {
    constructor: MultiSelect,

    init: function(){
      var that = this,
          ms = this.$element;

      if (ms.next('.ms-container').length == 0){
        ms.css({ position: 'absolute', left: '-9999px' });
        ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-'+Math.ceil(Math.random()*1000));



        var optgroupLabel = null,
            optgroupId = null,
            optgroupCpt = 0,
            scroll = 0;


        ms.find('optgroup, option').each(function(){
          if ($(this).is('optgroup')){
            optgroupLabel = $(this).attr('label');
            optgroupId = 'ms-'+ms.attr('id')+'-optgroup-'+optgroupCpt;

            that.$selectableUl.append(
              '<li class="ms-optgroup-container" id="'+optgroupId+'-selectable">\
                <ul class="ms-optgroup">\
                  <li class="ms-optgroup-label"><span>'+optgroupLabel+'</span></li>\
                </ul>\
              </li>');
            that.$selectionUl.append(
              '<li class="ms-optgroup-container" id="'+optgroupId+'-selection">\
                <ul class="ms-optgroup">\
                  <li class="ms-optgroup-label"><span>'+optgroupLabel+'</span></li>\
                </ul>\
              </li>');
            optgroupCpt++;
          } else {

            var attributes = "";

            for (var cpt = 0; cpt < this.attributes.length; cpt++){
              var attr = this.attributes[cpt];

              if(that.isDomNode(attr.name)){
                attributes += attr.name+'="'+attr.value+'" ';
              }
            }
            var selectableLi = $('<li '+attributes+'><span>'+$(this).text()+'</span></li>'),
                selectedLi = selectableLi.clone();

            var value = $(this).val();
            selectableLi.addClass('ms-elem-selectable').attr('id', value+'-selectable');
            selectedLi.addClass('ms-elem-selection').attr('id', value+'-selection').hide();

            that.$selectionUl.find('.ms-optgroup-label').hide();

            if ($(this).prop('disabled') || ms.prop('disabled')){
              selectableLi.prop('disabled', true);
              selectableLi.addClass(that.options.disabledClass);
            }

            if (optgroupId){
              that.$selectableUl.children('#'+optgroupId+'-selectable').find('ul').first().append(selectableLi);
              that.$selectionUl.children('#'+optgroupId+'-selection').find('ul').first().append(selectedLi);
            } else {
              that.$selectableUl.append(selectableLi);
              that.$selectionUl.append(selectedLi);
            }
          }
        });

        if (that.options.selectableHeader){
          that.$selectableContainer.append(that.options.selectableHeader);
        }
        that.$selectableContainer.append(that.$selectableUl);
        
        if (that.options.selectionHeader){
          that.$selectionContainer.append(that.options.selectionHeader);
        }
        this.$selectionContainer.append(that.$selectionUl);

        that.$container.append(that.$selectableContainer);
        that.$container.append(that.$selectionContainer);
        ms.after(that.$container);
        that.$selectableUl.on('mouseenter', '.ms-elem-selectable', function(){
          $('li', that.$container).removeClass('ms-hover');
          $(this).addClass('ms-hover');
        }).on('mouseleave', function(){
          $('li', that.$container).removeClass('ms-hover');
        });

        if(that.options.dblClick) {
          that.$selectableUl.on('dblclick', '.ms-elem-selectable', function(){
            that.select($(this).attr('id').replace(/-selectable/, ''));
          });
          that.$selectionUl.on('dblclick', '.ms-elem-selection', function(){
            that.deselect($(this).attr('id').replace(/-selection/, ''));
          });
        } else {
          that.$selectableUl.on('click', '.ms-elem-selectable', function(){
            that.select($(this).attr('id').replace(/-selectable/, ''));
          });
          that.$selectionUl.on('click', '.ms-elem-selection', function(){
            that.deselect($(this).attr('id').replace(/-selection/, ''));
          });
        }


        that.$selectionUl.on('mouseenter', '.ms-elem-selection', function(){
          $('li', that.$selectionUl).removeClass('ms-hover');
          $(this).addClass('ms-hover');
        }).on('mouseleave', function(){
          $('li', that.$selectionUl).removeClass('ms-hover');
        });

        that.$selectableUl.on('focusin', function(){
          $(this).addClass('ms-focus');
          that.$selectionUl.focusout();
        }).on('focusout', function(){
          $(this).removeClass('ms-focus');
          $('li', that.$container).removeClass('ms-hover');
        });

        that.$selectionUl.on('focusin', function(){
          $(this).addClass('ms-focus');
        }).on('focusout', function(){
          $(this).removeClass('ms-focus');
          $('li', that.$container).removeClass('ms-hover');
        });

        ms.on('focusin', function(){
          ms.focusout();
          that.$selectableUl.focusin();
        }).on('focusout', function(){
          that.$selectableUl.removeClass('ms-focus');
          that.$selectionUl.removeClass('ms-focus');
        });

        ms.onKeyDown = function(e, keyContainer){
          var ul = that.$container.find('.'+keyContainer).find('.ms-list'),
              lis = ul.find('li:visible:not(.ms-optgroup-label, .ms-optgroup-container)'),
              lisNumber = lis.length,
              liFocused = ul.find('li.ms-hover'),
              liFocusedIndex = liFocused.length > 0 ? lis.index(liFocused) : -1,
              ulHeight = ul.innerHeight(),
              liHeight = lis.first().outerHeight(true),
              numberOfLisDisplayed = Math.floor(ulHeight / liHeight);

          if (e.keyCode == 32){ // space
            if (liFocused.length >0){
              var method = keyContainer == 'ms-selectable' ? 'select' : 'deselect';
              if (keyContainer == 'ms-selectable'){
                that.select(liFocused.attr('id').replace('-selectable', ''));
              } else {
                that.deselect(liFocused.attr('id').replace('-selection', ''));
              }
              lis.removeClass('ms-hover');
              that.scrollTo = 0;
              ul.scrollTop(that.scrollTo);
            }
          } else if (e.keyCode == 40){ // Down
            if (lis.length > 0){
              var nextLiIndex = liFocusedIndex+1,
                  nextLi = (lisNumber != nextLiIndex) ? lis.eq(nextLiIndex) : lis.first(),
                  ulPosition = ul.position().top,
                  nextLiPosition = nextLi.position().top;

              lis.removeClass('ms-hover');
              nextLi.addClass('ms-hover');

              if (lisNumber == nextLiIndex){
                that.scrollTo = 0;
              } else if (nextLiPosition >= (ulPosition + (numberOfLisDisplayed * liHeight))){
                that.scrollTo += liHeight;
              }
              ul.scrollTop(that.scrollTo);
            }
          } else if (e.keyCode == 38){ // Up
            if (lis.length > 0){
              var prevLiIndex = Math.max(liFocusedIndex-1, -1),
                  prevLi = lis.eq(prevLiIndex),
                  ulPosition = ul.position().top,
                  prevLiPosition = prevLi.position().top;

              lis.removeClass('ms-hover');
              prevLi.addClass('ms-hover');
              if (prevLiPosition <= ulPosition){
                that.scrollTo -= liHeight;
              } else if (prevLiIndex < 0){
                that.scrollTo = (lisNumber - numberOfLisDisplayed) * liHeight;
              }
              ul.scrollTop(that.scrollTo);
            }
          } else if (e.keyCode == 37 || e.keyCode == 39){
            if (that.$selectableUl.hasClass('ms-focus')){
              that.$selectableUl.focusout();
              that.$selectionUl.focusin();
            } else {
              that.$selectableUl.focusin();
              that.$selectionUl.focusout();
            }        
          }
        }

        ms.on('keydown', function(e){
          if (ms.is(':focus')){
            var keyContainer = that.$selectableUl.hasClass('ms-focus') ? 'ms-selectable' : 'ms-selection';
            ms.onKeyDown(e, keyContainer);
          }
        });
      }

      var selectedValues = ms.find('option:selected').map(function(){ return $(this).val() }).get();
      that.select(selectedValues, 'init')

      if (typeof that.options.afterInit == 'function') {
        that.options.afterInit.call(this, this.$container);
      }
    },
    'refresh' : function() {
      $("#ms-"+this.$element.attr("id")).remove();
      this.init(this.options);
    },
    'select' : function(value, method){
      if (typeof value == 'string')
        value = [value]
      var that = this,
          ms = this.$element,
          selectables = this.$selectableUl.find('#' + value.join('-selectable, #')+'-selectable').filter(':not(.'+that.options.disabledClass+')'),
          selections = this.$selectionUl.find('#' + value.join('-selection, #') + '-selection'),
          options = ms.find('option').filter(function(index){ return($.inArray(this.value, value) > -1) });

      if (selectables.length > 0){
        selectables.addClass('ms-selected').hide();
        selections.addClass('ms-selected').show();
        options.prop('selected', true);

        var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
        if (selectableOptgroups.length > 0){
          selectableOptgroups.each(function(){
            var selectablesLi = $(this).find('.ms-elem-selectable');
            if (selectablesLi.length == selectablesLi.filter('.ms-selected').length){
              $(this).find('.ms-optgroup-label').hide();
            }
          });

          var selectionOptgroups = that.$selectionUl.children('.ms-optgroup-container');
          selectionOptgroups.each(function(){
            var selectionsLi = $(this).find('.ms-elem-selection');
            if (selectionsLi.filter('.ms-selected').length > 0){
              $(this).find('.ms-optgroup-label').show();
            }
          });
        }
        if (method != 'init'){
          that.$selectionUl.focusout();
          that.$selectableUl.focusin();
          ms.trigger('change');
          if (typeof that.options.afterSelect == 'function') {
            that.options.afterSelect.call(this, value);
          }
        }
      }
    },
    'deselect' : function(value){
      if (typeof value == 'string')
        value = [value]
      var that = this,
          ms = this.$element,
          selectables = this.$selectableUl.find('#' + value.join('-selectable, #')+'-selectable'),
          selections = this.$selectionUl.find('#' + value.join('-selection, #')+'-selection').filter('.ms-selected'),
          options = ms.find('option').filter(function(index){ return($.inArray(this.value, value) > -1) });

      if (selections.length > 0){
        selectables.removeClass('ms-selected').show();
        selections.removeClass('ms-selected').hide();
        options.prop('selected', false);

        var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
        if (selectableOptgroups.length > 0){
          selectableOptgroups.each(function(){
            var selectablesLi = $(this).find('.ms-elem-selectable');
            if (selectablesLi.filter(':not(.ms-selected)').length > 0){
              $(this).find('.ms-optgroup-label').show();
            }
          });

          var selectionOptgroups = that.$selectionUl.children('.ms-optgroup-container');
          selectionOptgroups.each(function(){
            var selectionsLi = $(this).find('.ms-elem-selection');
            if (selectionsLi.filter('.ms-selected').length == 0){
              $(this).find('.ms-optgroup-label').hide();
            }
          });
        }
        this.$selectableUl.focusout();
        this.$selectionUl.focusin();
        ms.trigger('change');
        if (typeof that.options.afterDeselect == 'function') {
          that.options.afterDeselect.call(this, value);
        }
      }
    },
    'select_all' : function(){
      var ms = this.$element;

      ms.find('option').prop('selected', true);
      this.$selectableUl.find('.ms-elem-selectable').addClass('ms-selected').hide();
      this.$selectionUl.find('.ms-optgroup-label').show();
      this.$selectableUl.find('.ms-optgroup-label').hide();
      this.$selectionUl.find('.ms-elem-selection').addClass('ms-selected').show();
      this.$selectionUl.focusin();
      this.$selectableUl.focusout();
      ms.trigger('change');
    },
    'deselect_all' : function(){
      var ms = this.$element;

      ms.find('option').prop('selected', false);
      this.$selectableUl.find('.ms-elem-selectable').removeClass('ms-selected').show();
      this.$selectionUl.find('.ms-optgroup-label').hide();
      this.$selectableUl.find('.ms-optgroup-label').show();
      this.$selectionUl.find('.ms-elem-selection').removeClass('ms-selected').hide();
      this.$selectableUl.focusin();
      this.$selectionUl.focusout();
      ms.trigger('change');
    },
    isDomNode: function (attr){
      return (
        attr &&
        typeof attr === "object" &&
        typeof attr.nodeType === "number" &&
        typeof attr.nodeName === "string"
      );
    }
  }

  /* MULTISELECT PLUGIN DEFINITION
   * ======================= */

  $.fn.multiSelect = function () {
    var option = arguments[0],
        args = arguments;
    
    return this.each(function () {
      var $this = $(this),
          data = $this.data('multiselect'),
          options = $.extend({}, $.fn.multiSelect.defaults, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('multiselect', (data = new MultiSelect(this, options)))

      if (typeof option == 'string'){
        data[option](args[1])
      } else {
        data.init();
      }
    })
  }

  $.fn.multiSelect.defaults = {
    disabledClass : 'disabled',
    dblClick : false
  }

  $.fn.multiSelect.Constructor = MultiSelect

}(window.jQuery);