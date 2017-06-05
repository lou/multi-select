# [jquery multi-select.js](http://loudev.com/)

## Summary 

- [About](#about)
- [Creator](#creator)
- [Usage and demos](#usage)
- [License](#license)

## About
I'm a user-friendlier drop-in replacement for the standard select with multiple attribute activated.

## Creator
@lou [http://loudev.com](http://loudev.com "jquery.multi-select.js")

## Contributors
@outofpluto

### Usage

HTML
-----------
```html
<html>
  <head>
    <link href="path/to/multiselect.css" media="screen" rel="stylesheet" type="text/css">
  </head>
  <body>
    <select multiple="multiple" id="my-select" name="my-select[]">
      <option value='elem_1'>elem 1</option>
      <option value='elem_2'>elem 2</option>
      <option value='elem_3'>elem 3</option>
      <option value='elem_4'>elem 4</option>
      ...
      <option value='elem_100'>elem 100</option>
    </select>
    <script src="path/to/jquery.multi-select.js" type="text/javascript"></script>
  </body>
</html>```

JavaScript
-----------
```JavaScript
$('#my-select').multiSelect();
```

The plugin has a set of options:

```JavaScript
$('#my-select').multiSelect({
	afterInit: function(container){}	// Function to call after the multiSelect initilization.
	afterSelect: function(values){} 	// Function to call after one item is selected.
	afterDeselect: function(values){} 	// Function to call after one item is deselected.

	selectableHeader: null			// Text or HTML to display in the selectable header.
	selectionHeader: null			// Text or HTML to display in the selection header.
	selectableFooter: null			// Text or HTML to display in the selectable footer.
	selectionFooter: null 			// Text or HTML to display in the selection footer.

	selectableOptgroup: false		// Cick on optgroup will select all nested options when set to true.
	keepOrder: false 			// The selected items will be displayed in the same order than they are selected.
	dblClick: false 			// Replace the defautl click event to select items by the dblclick one.
	searchEngine: false			// Add an input text to search/filter elements

	cssClass: ""				// Add a custom CSS class to the multiselect container.
	disabledClass: 'disabled' 		// CSS class for disabled items.
	
	previewButton: function($button){}	// Add a preview button and call the function when clicked
	selectButton: true|function($button){}	// Add a select button and call the function when clicked. If set to true, the callback function is simply the select/deselect. If set to a function, it is called AFTER select/deselect. Note that the label itself is not clickable when the button is added
	selectAll: null				// CSS class for a select-all-html-tag that has been added into the DOM (with selectableFooter or selectableHeader for instance)
	deselectAll: null			// CSS class for a deselect-all-html-tag that has been added into the DOM (with selectableFooter or selectableHeader for instance)
	counterClass: null			// CSS class for two html tags that will contain the bnumbers of elements available in each list. They must be in the ms-container so they should be created using selectableFooter or selectableHeader)
})
```


### License
Multi-select is released under the [MIT License](http://opensource.org/licenses/MIT "MIT License").
