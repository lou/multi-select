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
  var hash = 0, i, char;
  if (value.length == 0) return hash;
  var ls = 0;
  for (i = 0, ls = value.length; i < ls; i++) {
    char  = value.charCodeAt(i);
    hash  = ((hash<<5)-hash)+char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
