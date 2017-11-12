
// get url parameter
function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

// run on window.load
window.onload= function () {
  var id = getQueryVariable("id")
  console.log(id)
  if(id) {
    var listItem = document.getElementById(id);
    $('.collapsible').collapsible('open', $(".list-item").index(listItem));
  }
}


// run on document.ready
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
  });
  $('.carousel').carousel();
  console.log("done carouselling")


$(".collapsible-header").click(function(event) {
  if($(this).parent().hasClass("active")) {
    console.log("is active..");
  } else {
    let id = $(this).data("scroll");
    let destination = document.getElementById(id);
    setTimeout(function() {
      $('html, body').animate({
          scrollTop: ($(destination).position().top - 50)
      }, 300);
    }, 600, destination);
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
  console.log(stickySidebar)
    if ($(window).scrollTop() > stickySidebar) {
        $('#item-list-header').addClass('fixed');
    }
    else {
        $('#item-list-header').removeClass('fixed');
    }
});

});

$(".thatsMyItem").click(function(event) {
  console.log("modallllll")
  var title = $(this).data("title")
  var price = $(this).data("price")
  var image = $(this).data("image")
  var url = "/amazon?" + "id=" + $(this).data("item") + "&" + "asin=" + $(this).data("asin")
  $("#amazonItemTitle").html(title)
  $("#amazonItemPrice").html(price)
  $("#amazonItemImage").attr('src', image)
  $("#amazonItemAsin").attr('href', url)
  $('#thatsMyItem').modal('open');
})



google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Living Room',     11],
    ["Lindsey's Room",      2],
    ['Garage',  2],
    ['Master Bedroom', 2],
    ["Kevin's Room",    7]
  ]);

  var options = {
    title: 'Items by Room'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
