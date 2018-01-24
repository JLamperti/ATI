$(document).ready(function() {
  $("#toggleDetails").click(function() {
    var up = "up";
    if (document.getElementById('toggleDetails').innerHTML== '<p><span class="glyphicon glyphicon-menu-up"></span></p>') {
      document.getElementById('toggleDetails').innerHTML = ('<p><span class="glyphicon glyphicon-menu-down"></span></p>');
    } else {
      document.getElementById('toggleDetails').innerHTML= ('<p><span class="glyphicon glyphicon-menu-up"></span></p>');
    }
    $("#details").slideToggle();


  });
});
