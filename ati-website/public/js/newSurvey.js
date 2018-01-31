$(document).ready(function() {

  $('#testButton').on('click', function() {
    var SID = 1;
    displayProbandCount(SID);
    displayAvgAti(SID);
    displayAtiStd(SID);
    var url = "http://87.146.242.114:3000/db/survey?SID=";
    fetch(url + SID)
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        $('#surveyName').append(res[0].SurveyName);
        $('#beginDate').append(res[0].SurveyBegin);
        $('#endDate').append(res[0].SurveyEnd);
        if (res[0].SurveyEnd != null) {
          /* make the second part of the text visible again */
          $('#periodEndText').css("display", "inline");
        }

        $('#status').append(res[0].SurveyStatus);
        $("display", "inherit");
        $('#resultsArea');

        $('#participantsTotal').append(res[0].MaxProbands);
        if (res[0].MaxProbands != null) {
          $('#participantTextMiddle').css("display", "inherit");
        }


      })
      .catch(err => {
        throw err
      });
  });


  $('#submit').on('click', function() {
    /*tmp var */
    var UID = 1;

    var coverLetter = $('#coverLetter').val();
    var emails = $('#emailList').text();
    for (mail in emails) {
      mail = mail.replace("remove", "");
    }

    var surveyName = $('#surveyName').val();
    var begin = $('#begin').val();
    var end = $('#end').val();
    var status = 'closed';
    var takeAge = $('#takeAge').val();
    var takeSex = $('#takeSex').val();
    var takeEducation = $('#takeEducation').val();
    var description = $('#description').val();
    if ($('#enableMaxProbands').is(':checked')) {
      var MaxProbands = $('#MaxProbands').val();
    }

    //<!--mandatory-paramter is UID (user-ID).
    //* optional-paramters are Name, Description, MaxProbands, Status, Begin, End, inviteText, takeEducation, takeAge, takeSex-->
    let testData = JSON.stringify({
      UID: UID,
      Name: surveyName,
      Description: description,
      MaxProbands: MaxProbands,
      Status: status,
      Begin: begin,
      End: end,
      inviteText: coverLetter,
      takeEducation: takeEducation,
      takeAge: takeAge,
      takeSex: takeSex
    });

    console.log(testData);
    let postUrl = 'http://87.146.242.114:3000/db/survey';
    fetch(postUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: testData
      })
      .then((out) => {
        console.log(out);
      })
      .catch(err => {
        throw err
      });


  });

  let data = new FormData();
  //data.append("UID", UID);

  data.append("surveyName", surveyName);
  data.append("begin", begin);
  data.append("end", end);
  data.append("takeAge", takeAge);
  data.append("takeSex", takeSex);
  data.append("takeEducation", takeEducation);
  data.append("description", description);
  data.append("MaxProbands", MaxProbands);



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
   * sets default start date to today
   */
  $('#begin').val(new Date().toDateInputValue());

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

function displayProbandCount(SID) {
  var url = "http://87.146.242.114:3000/db/countProbandInSurvey?SID=";
  fetch(url + SID)
    .then(res => res.json())
    .then((countProbandInSurvey) => {
      $('#participantsCurrent').append(countProbandInSurvey[0].count);
    })
    .catch(err => {
      throw err
    });
}

function displayAvgAti(SID) {
  var url = "http://87.146.242.114:3000/db/avg?sel[0]=atiScore&fromSurv=";
  fetch(url + SID)
    .then(res => res.json())
    .then((avgAtiScore) => {
      $('#avgAtiScore').append(avgAtiScore[0].avgatiScore);
    })
    .catch(err => {
      throw err
    });
}

function displayAtiStd(SID) {
  var url = "http://87.146.242.114:3000/db/std?SID=";
  fetch(url + SID)
    .then(res => res.json())
    .then((std) => {
      $('#atiStd').append(std[0].stdatiScore);
    })
    .catch(err => {
      throw err
    });
}
http: //87.146.242.114:3000/db/std?SID="

  /**
   *returns timezone-offset date
   */
  Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  });
