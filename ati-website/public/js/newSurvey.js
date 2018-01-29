$(document).ready(function() {

  var copyUrlBtn = document.querySelector('#copyUrlBtn');
  copyUrlBtn.addEventListener('click', function(event) {
    /* Get the text field */
    var copyText = document.getElementById("surveyLink");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("Copy");
    console.log("done");
  });


  $('#showHideRawData').on('click', function() {
    console.log("clicked");

    var button = $('#showHideRawData #buttonText')
    console.log(button);

    if (button.hasClass("glyphicon-menu-up")) {
      button.addClass("glyphicon-menu-down");
      button.removeClass("glyphicon-menu-up");
    } else {
      button.addClass("glyphicon-menu-up");
      button.removeClass("glyphicon-menu-down");
    }
    $('#rawData').slideToggle();

  });



  $('#addMail').on('click', function() {
    if (document.getElementById('mailAddress').checkValidity()) {
      var mail = $('#mailAddress').val();
      if (checkUnique(mail)) {

        mail = mail.split(",");
        for (var address in mail) {
          $('#emailList').append('<button type="button" class="list-group-item list-group-item-action rm-on-click">' + mail[address] + '</button>');

        }
      } else {
        console.log("not a valid email");
      }
    }


  });




  $('#emailList').on('click', '.rm-on-click', function() {
    $(this).remove();
  });

});


function checkUnique(mail) {
  /* check if email is already listed */
  var emails = $('#emailList').text();
  console.log(emails);
  console.log(mail);

  if (emails.indexOf(mail) != -1) {
    return false;
  }
  return true;


}
