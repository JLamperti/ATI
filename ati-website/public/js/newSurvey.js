$(document).ready(function() {
  var IP = "http://87.146.242.114:3000";
  var UID = 1;
  var SID = 1;



  var pathname = window.location.pathname;
  if (pathname.indexOf("surveyDetails")) {

    $('#exportCSV').attr("href", IP + "/db/exportCSV?SID=" + SID);
    displayProbandCount(SID);
    displayAvgAti(SID);
    displayAtiStd(SID);
    displaySurveyLink(SID);
    var url = "/db/survey";
    var query = "?SID=" + SID;
    fetch(IP + url + query)
      .then(res => res.json())
      .then((res) => {
        $('#surveyName').append(res[0].SurveyName);
        $('#beginDate').append(res[0].SurveyBegin);
        $('#endDate').append(res[0].SurveyEnd);
        if (res[0].SurveyEnd != null) {
          /* make the second part of the text visible again */
          $('#periodEndText').css("display", "inline");
        }
        var takeAge = (res[0].TakeAge.data[0] == 1) ? true : false;
        $("#takeAgeCbx").prop("checked", takeAge);
        var takeSex = (res[0].takeSex.data[0] == 1) ? true : false;
        $("#takeSexCbx").prop("checked", takeSex);
        var takeEdu = (res[0].TakeEducation.data[0] == 1) ? true : false;
        $("#takeEduCbx").prop("checked", takeEdu);
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
  }





  /**
   * Submits form data to server
   */
  $('#submit').on('click', function() {

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

    let url = '/db/survey';
    fetch(IP + url, {
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
   * sets default start date of a survey to today
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

  /**
   * checks if an email is already contained in the page
   * @param mail: the email that may be contained in the listed
   * @return: email is contained in the page: true/false
   */
  function checkUnique(mail) {
    var emails = $('#emailList').text();

    if (emails.indexOf(mail) != -1) {
      return false;
    }
    return true;


  }

  /**
   * gets and displays one of the survey links
   * TODO: list all available survey links
   */
  function displaySurveyLink(SID) {
    var url = "/db/links";
    var query = "?SID=" + SID;
    fetch(IP + url + query)
      .then(res => res.json())
      .then((links) => {
        console.log(links);
        for (link in links) {
          console.log(links[link].url);
          $('#surveyLink').val("https://technikaffinitaet.de/form?inv=" + links[link].url);
        }

      })
      .catch(err => {
        throw err
      });
    // TODO: klajsdkjas
  }

  /**
   * gets the number of probands and adds it to the display
   */
  function displayProbandCount(SID) {
    var url = "/db/countProbandInSurvey";
    var query = "?SID=" + SID;
    fetch(IP + url + query)
      .then(res => res.json())
      .then((countProbandInSurvey) => {
        $('#participantsCurrent').append(countProbandInSurvey[0].count);
      })
      .catch(err => {
        throw err
      });
  }
  /**
   * gets and the average ATI-score for the survey and adds it to the display
   */
  function displayAvgAti(SID) {
    var url = "/db/avg?sel[0]=atiScore&fromSurv=";
    var query = "?sel[0]=atiScore&fromSurv=" + SID;
    fetch(IP + url + query)
      .then(res => res.json())
      .then((avgAtiScore) => {
        $('#avgAtiScore').append(avgAtiScore[0].avgatiScore);
      })
      .catch(err => {
        throw err
      });
  }

  /**
   * gets the standard deviations of ATI, Age (and one other value, not sure which one atm) and adds the ATI-std to the display
   */
  function displayAtiStd(SID) {
    var url = "/db/std";
    var query = "?SID=" + SID;
    fetch(IP + url + query)
      .then(res => res.json())
      .then((std) => {
        $('#atiStd').append(std[0].stdatiScore);
      })
      .catch(err => {
        throw err
      });
  }

});


/**
 *returns timezone-offset date
 */
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});
