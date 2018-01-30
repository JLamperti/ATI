$(document).ready(function() {


  $('#testButton').on('click', function() {
    var SID = 1;
    var url = "http://87.146.244.248:3000/db/survey?SID=1";
    fetch(url)
      .then(res => res.json())
      .then((out) => {

        $('#surveyName').append(out.SurveyName);
        $('#beginDate').append(out.SurveyBegin);
        $('#endDate').append(out.SurveyEnd);
        if (out.SurveyEnd != null) {
          $('#periodEndText').css("display", "inline");
        }

        var url = "http://87.146.240.111:3000/db/countProbandInSurvey?SID=";
        fetch(url + SID)
          .then(res => res.json())
          .then((res) => {
            $('#participantsCurrent').append(res.length);
          })
          .catch(err => {
            throw err
          });
        $('#participantsTotal').append(out.MaxProbands);
        if (out.MaxProbands != null) {
          $('#participantTextMiddle').css("display", "inherit");
        }
        $('#status').append(out.SurveyStatus);
        $("display", "inherit");
        $('#resultsArea');

        // /db/avg?sel[0]=atiScore&fromSurv=X

        console.log(out);
      })
      .catch(err => {
        throw err
      });
  });


  /**
   * copies displayed URL into clipboard on click
   */
  var copyUrlBtn = document.querySelector('#copyUrlBtn');
  copyUrlBtn.addEventListener('click', function(event) {
    /* Get the text field */
    var copyText = document.getElementById("surveyLink");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("Copy");
  });


  /**
   * toggles the display of the raw data table
   */
  $('#showHideRawData').on('click', function() {

    var button = $('#showHideRawData #buttonText')

    if (button.hasClass("glyphicon-menu-up")) {
      button.addClass("glyphicon-menu-down");
      button.removeClass("glyphicon-menu-up");
    } else {
      button.addClass("glyphicon-menu-up");
      button.removeClass("glyphicon-menu-down");
    }
    $('#rawData').slideToggle();

  });


  /**
   * adds the entered mail to the mailing list if its valid
   */
  $('#addMail').on('click', function() {
    if (document.getElementById('mailAddress').checkValidity()) {
      var mail = $('#mailAddress').val();
      if (checkUnique(mail)) {

        mail = mail.split(",");
        for (var address in mail) {
          $('#emailList').append(
            '<a class="list-group-item list-group-item-action clearfix">' +
            mail +
            '<button type="button" name="button" class="rm-on-click pull-right"><span class="glyphicons glyphicons-delete">remove</span></button></a>');

        }
      } else {
        console.log("not a unique email");
      }
    } else {
      console.log("not a valid email");
    }
  });

  /**
   * removes an email from the mailing list
   */
  $('#emailList').on('click', '.rm-on-click', function() {
    $(this).parent().remove();
  });

});


/**
 * checks if an email is already contained in the page
 * @param mail: the email that may be contained in the listed
 * @return: email is contained in the list: true/false
 */
function checkUnique(mail) {
  /* check if email is already listed */
  var emails = $('#emailList').text();

  if (emails.indexOf(mail) != -1) {
    return false;
  }
  return true;


}
