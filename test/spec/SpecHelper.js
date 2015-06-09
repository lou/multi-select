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
  var hash = 5381;
  for (var i = 0; i < value.length; i++) {
      var c = value.charCodeAt(i);
      hash = (((hash << 5) >>> 0) + hash) + c; /* hash * 33 + c */
  }
  return hash;
}
