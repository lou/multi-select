/*
* MultiSelect v0.9.6
* Copyright (c) 2012 Louis Cuny
*
* This program is free software. It comes without any warranty, to
* the extent permitted by applicable law. You can redistribute it
* and/or modify it under the terms of the Do What The Fuck You Want
* To Public License, Version 2, as published by Sam Hocevar. See
* http://sam.zoy.org/wtfpl/COPYING for more details.
*/

!function ($) {

  "use strict";


 /* MULTISELECT CLASS DEFINITION
  * ====================== */

  var MultiSelect = function (element, options) {
    this.options = options;
    this.$element = $(element);

    var id = this.$element.attr('id');

    this.$container = $('<div/>', { 'id': "ms-"+id, 'class': "ms-container" });
    this.$selectableContainer = $('<div/>', { 'class': 'ms-selectable' });
    this.$selectionContainer = $('<div/>', { 'class': 'ms-selection' });
    this.$selectableUl = $('<ul/>', { 'class': "ms-list", 'tabindex' : '-1' });
    this.$selectionUl = $('<ul/>', { 'class': "ms-list", 'tabindex' : '-1' });
    this.scrollTo = 0;
    this.sanitizeRegexp = new RegExp("\\W+", 'gi');
    this.elemsSelector = 'li:visible:not(.ms-optgroup-label,.ms-optgroup-container)';
  };

  MultiSelect.prototype = {
    constructor: MultiSelect,

    init: function(){
      var that = this,
          ms = this.$element;

      if (ms.next('.ms-container').length === 0){
        ms.css({ position: 'absolute', left: '-9999px' });
        ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-'+Math.ceil(Math.random()*1000));

        var optgroupLabel = null,
            optgroupId = null,
            optgroupCpt = 0,
            optgroupContainerTemplate = '<li class="ms-optgroup-container"></li>',
            optgroupUlTemplate = '<ul class="ms-optgroup"></ul>',
            optgroupLiTemplate = '<li class="ms-optgroup-label"><span></span></li>';

        ms.find('optgroup, option').each(function(){
          if ($(this).is('optgroup')){
            optgroupLabel = '<span>'+$(this).attr('label')+'</span>';
            optgroupId = 'ms-'+ms.attr('id')+'-optgroup-'+optgroupCpt;

            var optgroup = $(this),
                optgroupSelectable = $(optgroupContainerTemplate),
                optgroupSelection = $(optgroupContainerTemplate),
                optgroupSelectionLi = $(optgroupLiTemplate),
                optgroupSelectableLi = $(optgroupLiTemplate);

            if (that.options.selectableOptgroup){
              optgroupSelectableLi.on('click', function(){
                var values = optgroup.children(':not(:selected)').map(function(){ return $(this).val(); }).get();
                that.select(values);
              });

              optgroupSelectionLi.on('click', function(){
                var values = optgroup.children(':selected').map(function(){ return $(this).val(); }).get();
                that.deselect(values);
              });
            }

            optgroupSelectableLi.html(optgroupLabel);

            optgroupSelectable.attr('id', optgroupId+'-selectable')
              .append($(optgroupUlTemplate)
                .append(optgroupSelectableLi));

            that.$selectableUl.append(optgroupSelectable);

            optgroupSelectionLi.html(optgroupLabel);

            optgroupSelection.attr('id', optgroupId+'-selection')
              .append($(optgroupUlTemplate)
                .append(optgroupSelectionLi));

            that.$selectionUl.append(optgroupSelection);

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

            var value = $(this).val(),
                msId = that.sanitize(value, that.sanitizeRegexp);

            selectableLi
              .data('ms-value', value)
              .addClass('ms-elem-selectable')
              .attr('id', msId+'-selectable');

            selectedLi
              .data('ms-value', value)
              .addClass('ms-elem-selection')
              .attr('id', msId+'-selection')
              .hide();

            that.$selectionUl.find('.ms-optgroup-label').hide();

            if ($(this).prop('disabled') || ms.prop('disabled')){
              if (this.selected) {
                selectedLi.prop('disabled', true);
                selectedLi.addClass(that.options.disabledClass);
              } else {
                selectableLi.prop('disabled', true);
                selectableLi.addClass(that.options.disabledClass);
              }
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
        if (that.options.selectableFooter){
          that.$selectableContainer.append(that.options.selectableFooter);
        }

        if (that.options.selectionHeader){
          that.$selectionContainer.append(that.options.selectionHeader);
        }
        that.$selectionContainer.append(that.$selectionUl);
        if (that.options.selectionFooter){
          that.$selectionContainer.append(that.options.selectionFooter);
        }

        that.$container.append(that.$selectableContainer);
        that.$container.append(that.$selectionContainer);
        ms.after(that.$container);

        that.activeMouse(that.$selectableUl);
        that.activeKeyboard(that.$selectableUl);

        var action = that.options.dblClick ? 'dblclick' : 'click';

        that.$selectableUl.on(action, '.ms-elem-selectable', function(){
          that.select($(this).data('ms-value'));
        });
        that.$selectionUl.on(action, '.ms-elem-selection', function(){
          that.deselect($(this).data('ms-value'));
        });

        that.activeMouse(that.$selectionUl);
        that.activeKeyboard(that.$selectionUl);

        ms.on('focus', function(){
          that.$selectableUl.focus();
        })
      }

      var selectedValues = ms.find('option:selected').map(function(){ return $(this).val(); }).get();
      that.select(selectedValues, 'init');

      if (typeof that.options.afterInit === 'function') {
        that.options.afterInit.call(this, this.$container);
      }
    },

    'activeKeyboard' : function($list){
      var that = this;

      $list.on('focus', function(){
        $(this).addClass('ms-focus');
      })
      .on('blur', function(){
        $(this).removeClass('ms-focus');
      })
      .on('keydown', function(e){
        switch (e.which) {
          case 40:
          case 38:
            e.preventDefault();
            e.stopPropagation();
            that.moveHighlight($(this), (e.which === 38) ? -1 : 1);
            return;
          case 32:
            e.preventDefault();
            e.stopPropagation();
            that.selectHighlighted($list);
            return;
          case 37:
          case 39:
            e.preventDefault();
            e.stopPropagation();
            that.switchList($list);
            return;
        }
      });
    },

    'moveHighlight': function($list, direction){
      var $elems = $list.find(this.elemsSelector),
          $currElem = $elems.filter('.ms-hover'),
          $nextElem = null,
          elemHeight = $elems.first().outerHeight(),
          containerHeight = $list.height(),
          containerSelector = '#'+this.$container.prop('id');

      // Deactive mouseenter event when move is active
      // It fixes a bug when mouse is over the list
      $elems.off('mouseenter');

      $elems.removeClass('ms-hover');
      if (direction === 1){ // DOWN

        $nextElem = $currElem.nextAll(this.elemsSelector).first();
        if ($nextElem.length === 0){
          var $optgroupUl = $currElem.parent();

          if ($optgroupUl.hasClass('ms-optgroup')){
            var $optgroupLi = $optgroupUl.parent(),
                $nextOptgroupLi = $optgroupLi.next(':visible');

            if ($nextOptgroupLi.length > 0){
              $nextElem = $nextOptgroupLi.find(this.elemsSelector).first();
            } else {
              $nextElem = $elems.first();
            }
          } else {
            $nextElem = $elems.first();
          }
        }
      } else if (direction === -1){ // UP

        $nextElem = $currElem.prevAll(this.elemsSelector).first();
        if ($nextElem.length === 0){
          var $optgroupUl = $currElem.parent();

          if ($optgroupUl.hasClass('ms-optgroup')){
            var $optgroupLi = $optgroupUl.parent(),
                $prevOptgroupLi = $optgroupLi.prev(':visible');

            if ($prevOptgroupLi.length > 0){
              $nextElem = $prevOptgroupLi.find(this.elemsSelector).last();
            } else {
              $nextElem = $elems.last();
            }
          } else {
            $nextElem = $elems.last();
          }
        }
      }
      if ($nextElem.length > 0){
        $nextElem.addClass('ms-hover');
        var scrollTo = $list.scrollTop() + $nextElem.position().top - 
                       containerHeight / 2 + elemHeight / 2;

        $list.scrollTop(scrollTo);
      }
    },

    'selectHighlighted' : function($list){
        var $elems = $list.find(this.elemsSelector),
            $highlightedElem = $elems.filter('.ms-hover').first();

        if ($highlightedElem.length > 0){
          if ($list.parent().hasClass('ms-selectable')){
            this.select($highlightedElem.data('ms-value'));
          } else {
            this.deselect($highlightedElem.data('ms-value'));
          }
          $elems.removeClass('ms-hover');
        }
    },

    'switchList' : function($list){
      $list.blur();
      if ($list.parent().hasClass('ms-selectable')){
        this.$selectionUl.focus();
      } else {
        this.$selectableUl.focus();
      }
    },

    'activeMouse' : function($list){
      var that = this;

      $list.on('mousemove', function(){
        var elems = $list.find(that.elemsSelector);

        elems.on('mouseenter', function(){
          elems.removeClass('ms-hover');
          $(this).addClass('ms-hover');
        });
      });
    },

    'refresh' : function() {
      this.destroy();
      this.$element.multiSelect(this.options);
    },

    'destroy' : function(){
      $("#ms-"+this.$element.attr("id")).remove();
      this.$element.removeData('multiselect');
    },

    'select' : function(value, method){
      if (typeof value === 'string'){ value = [value]; }

      var that = this,
          ms = this.$element,
          msIds = $.map(value, function(val){ return(that.sanitize(val, that.sanitizeRegexp)); }),
          selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #')+'-selectable').filter(':not(.'+that.options.disabledClass+')'),
          selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection'),
          options = ms.find('option').filter(function(){ return($.inArray(this.value, value) > -1); });

      if (selectables.length > 0){
        selectables.addClass('ms-selected').hide();
        selections.addClass('ms-selected').show();
        options.prop('selected', true);

        var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
        if (selectableOptgroups.length > 0){
          selectableOptgroups.each(function(){
            var selectablesLi = $(this).find('.ms-elem-selectable');
            if (selectablesLi.length === selectablesLi.filter('.ms-selected').length){
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
        if (method !== 'init'){
          ms.trigger('change');
          if (typeof that.options.afterSelect === 'function') {
            that.options.afterSelect.call(this, value);
          }
        }
      }
    },

    'deselect' : function(value){
      if (typeof value === 'string'){ value = [value]; }

      var that = this,
          ms = this.$element,
          msIds = $.map(value, function(val){ return(that.sanitize(val, that.sanitizeRegexp)); }),
          selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #')+'-selectable'),
          selections = this.$selectionUl.find('#' + msIds.join('-selection, #')+'-selection').filter('.ms-selected'),
          options = ms.find('option').filter(function(){ return($.inArray(this.value, value) > -1); });

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
            if (selectionsLi.filter('.ms-selected').length === 0){
              $(this).find('.ms-optgroup-label').hide();
            }
          });
        }
        ms.trigger('change');
        if (typeof that.options.afterDeselect === 'function') {
          that.options.afterDeselect.call(this, value);
        }
      }
    },

    'select_all' : function(){
      var ms = this.$element,
          values = ms.val();

      ms.find('option').prop('selected', true);
      this.$selectableUl.find('.ms-elem-selectable').addClass('ms-selected').hide();
      this.$selectionUl.find('.ms-optgroup-label').show();
      this.$selectableUl.find('.ms-optgroup-label').hide();
      this.$selectionUl.find('.ms-elem-selection').addClass('ms-selected').show();
      this.$selectionUl.focus();
      ms.trigger('change');
      if (typeof this.options.afterSelect === 'function') {
        var selectedValues = $.grep(ms.val(), function(item){
          return $.inArray(item, values) < 0;
        });
        this.options.afterSelect.call(this, selectedValues);
      }
    },

    'deselect_all' : function(){
      var ms = this.$element,
          values = ms.val();

      ms.find('option').prop('selected', false);
      this.$selectableUl.find('.ms-elem-selectable').removeClass('ms-selected').show();
      this.$selectionUl.find('.ms-optgroup-label').hide();
      this.$selectableUl.find('.ms-optgroup-label').show();
      this.$selectionUl.find('.ms-elem-selection').removeClass('ms-selected').hide();
      this.$selectableUl.focus();
      ms.trigger('change');
      if (typeof this.options.afterDeselect === 'function') {
        this.options.afterDeselect.call(this, values);
      }
    },

    isDomNode: function (attr){
      return (
        attr &&
        typeof attr === "object" &&
        typeof attr.nodeType === "number" &&
        typeof attr.nodeName === "string"
      );
    },

    sanitize: function(value, reg){
      return(value.replace(reg, '_'));
    }
  };

  /* MULTISELECT PLUGIN DEFINITION
   * ======================= */

  $.fn.multiSelect = function () {
    var option = arguments[0],
        args = arguments;

    return this.each(function () {
      var $this = $(this),
          data = $this.data('multiselect'),
          options = $.extend({}, $.fn.multiSelect.defaults, $this.data(), typeof option === 'object' && option);

      if (!data){ $this.data('multiselect', (data = new MultiSelect(this, options))); }

      if (typeof option === 'string'){
        data[option](args[1]);
      } else {
        data.init();
      }
    });
  };

  $.fn.multiSelect.defaults = {
    selectableOptgroup: false,
    disabledClass : 'disabled',
    dblClick : false
  };

  $.fn.multiSelect.Constructor = MultiSelect;

}(window.jQuery);