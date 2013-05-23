(function($){

  appendContributors = function(contributors){
    var source   = $('#contributors-tpl').html();
    var template = Handlebars.compile(source);
    
    $('#contributors').append(template({ contributors: contributors }));
  }

  $.ajax('https://api.github.com/repos/lou/multi-select/git/refs/tags')
  .done(function(data){
    var ref = data[data.length-1].ref;
    var tagNumber = ref.match(/(\d.+)*$/)[0];

    $('#brand').append(' <span>'+tagNumber+'</span>')
  })

  $.ajax('https://api.github.com/repos/lou/multi-select/contributors')
  .done(function(data){
    appendContributors(data);
  });
})(jQuery)
