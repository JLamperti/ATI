$(document).ready(function() {

  $("#editUserDetails").on('click', function() {
    var el = $(this);
    if (el.text() == el.data("text-swap")) {
      // switch to input fields
      el.text(el.data("text-original"));
      //el.prop("type", "submit");
      $("#nameField").html('<span class="grey text-item-descr">Name</span><input type="text" name="name" value="Dummy Name"></input>');
      $("#titleField").html('<span class="grey text-item-descr">Title</span><input type="text" name="title" value="Redundant Title"></input>');
      $('#emailField').html('<span class="grey text-item-descr">Email</span><input type="text" name="email" value="example@examplemail.com"></input>');
      $('#passwordField').html('<span class="grey text-item-descr">Password</span><input type="password" name="newPassword" value="password"></br></input> <span class="grey text-item-descr"> Confirm Password</span><input type="password" name="confirmPassword" value="password"></input>');
    } else {
      //switch back to standard view AND submit data
      //if (checkInputs()) {
        el.data("text-original", el.text());
        el.text(el.data("text-swap"));
        //el.prop("type", "button");
        $("#nameField").html("<h2>Dummy Name</h2>");
        $('#titleField').html("<h3>Redundant Title</h3>");
        $('#emailField').html('<span class="grey text-item-descr">Email</span><span>example@examplemail.com</span>');
        $('#passwordField').html('<span class="grey text-item-descr">Password</span><span>********</span>')
      //}
    }


  });


  $("#toggleDetails").click(function() {
    var up = "up";
    if (document.getElementById('toggleDetails').innerHTML == '<p><span class="glyphicon glyphicon-menu-up"></span></p>') {
      document.getElementById('toggleDetails').innerHTML = ('<p><span class="glyphicon glyphicon-menu-down"></span></p>');
    } else {
      document.getElementById('toggleDetails').innerHTML = ('<p><span class="glyphicon glyphicon-menu-up"></span></p>');
    }
    $("#details").slideToggle();
  });

});

function checkInputs() {
  //check if input values are valid here
  return false;

}
