$(document).ready(function() {
  $("#toggleDetails").click(function() {

    if (document.getElementById('toggleDetails').innerHTML == '<p><span class="glyphicon glyphicon-menu-down"></span></p>') {
      document.getElementById('toggleDetails').innerHTML = ('<p><span class="glyphicon glyphicon-menu-up"></span></p>');
    } else {
      document.getElementById('toggleDetails').innerHTML= ('<p><span class="glyphicon glyphicon-menu-down"></span></p>');
    }
    $("#details").slideToggle();

    /*$(this).html(function(v) {
      return v === "<p><span class='glyphicon glyphicon-menu-down'></span></p>" ? "a" : "<p><span class='glyphicon glyphicon-menu-up'></span></p>"
    });*/
  });
});
/*
if ("glyphicon-menu-down".indexOf(document.getElementById('toggleDetails').innerHTML)) {
  $('#toggleDetails').text("<p><span class='glyphicon glyphicon-menu-up'></span></p>");
} else {
  document.getElementById('toggleDetails').innerHTML = "<p><span class='glyphicon glyphicon-menu-down'></span></p>";
}
*/
/*$("#toggleDetails").click(
  $("#details").slideToggle();
);
*/
