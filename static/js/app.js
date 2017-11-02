$(document).ready(function() {
  Materialize.updateTextFields();
  console.log("done updating")
  $('select').material_select();
  console.log("done selectifying.")
  $('.collapsible').collapsible();
  console.log("done collapisifying.");
  $(".button-collapse").sideNav();
  console.log("done mobilifying")
  $('.parallax').parallax();
  $('.modal').modal({
    opacity: .5, // Opacity of modal background
    startingTop: "5%",
    endingTop: "25%"
  });


$(".collapsible-header").click(function(event) {
  if($(this).parent().hasClass("active")) {
    console.log("is active..");
  } else {
    let id = $(this).data("scroll");
    let name = $(this).find(".itemName").val();
    console.log(name)
    let destination = document.getElementById(id);
    let height = $("#item-list-header").height();

    setTimeout(function() {
      $('html, body').animate({
          scrollTop: ($(destination).position().top - 50)
      }, 300);
    }, 600, [destination, height]);
  }

});

$(".deleteModal").click(function(event) {
  let target = "/delete/" + $(this).data('id');
  $("#deleteTarget").attr("href", target);
  console.log(target)
  $('.modal').modal('open');
})

$( "#roomSelect" ).change(function(event) {
  if($(this).val() == 0) {
    $('#modal1').modal('open');
  }
});

var stickySidebar = $('.sticky').offset().top;

$(window).scroll(function() {
    if ($(window).scrollTop() > stickySidebar) {
        $('#item-list-header').addClass('fixed');
    }
    else {
        $('#item-list-header').removeClass('fixed');
    }
});






});
