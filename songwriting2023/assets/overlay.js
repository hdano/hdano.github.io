$('#overlay').show();

$(document).ready(function(){
  $('#overlay').fadeOut();
})

$(window).on('beforeunload',function() {
  $('#overlay').fadeIn();
})

$("form").submit(function(event){
  $('#overlay').fadeIn();
});