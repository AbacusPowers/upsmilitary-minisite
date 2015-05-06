//$(function() {
//  $("#modal-1").on("change", function() {
//    if ($(this).is(":checked")) {
//      $("body").addClass("modal-open");
//    } else {
//      $("body").removeClass("modal-open");
//    }
//  });
//
//  $(".modal-fade-screen, .modal-close").on("click", function() {
//    $(".modal-state:checked").prop("checked", false).change();
//  });
//
//  $(".modal-inner").on("click", function(e) {
//    e.stopPropagation();
//  });
//});
$('.article-link').click(function(){
    $('#overlay').show();
    $('#modal').fadeIn();
});
$('#close-modal').click(function(){
    $('#overlay').hide();
    $('#modal').hide();
});
