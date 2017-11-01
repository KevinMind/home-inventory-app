$(document).ready(function() {
  Materialize.updateTextFields();
  console.log("done updating")
  $('select').material_select();
  console.log("done selectifying.")
  $('.collapsible').collapsible();
  console.log("done collapisifying.");


$(".list-item").click(function(event) {

    let id = $(this).data("scroll");
    let destination = document.getElementById(id);
    let height = $("#item-list-header").height();

    setTimeout(function() {
      $('html, body').animate({
          scrollTop: ($(destination).position().top - 70)
      }, 300);
      console.log(height);
      console.log(destination)
    }, 300, [destination, height]);


});






});
