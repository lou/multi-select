var select;
var msContainer;

beforeEach(function() {
  $('<select id="multi-select" multiple="multiple" name="test[]"></select>').appendTo('body');
  for (var i=1; i <= 10; i++) {
    $('<option value="value'+i+'">text'+i+'</option>').appendTo($("#multi-select"));
  };
  select = $("#multi-select");
});

afterEach(function () {
  $("#multi-select, #multi-select-optgroup, .ms-container").remove();
});

sanitize = function(value){
  reg = new RegExp("\\W+", 'gi');
  return value.replace(reg, '_');
}