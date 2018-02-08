$(document).ready(function() {
  var IP = "";
  var SID = $('#surveyId').html();

  $('#exportCSV').attr("href", IP + "/db/exportCSV?SID=" + SID);
  displayProbandCount(SID);
  displayAvgAti(SID);
  displayAtiStd(SID);
  displaySurveyLinks(SID);
  var url = "/db/survey";
  var query = "?SID=" + SID;
  fetch(IP + url + query, {
      credentials: 'include'
    })
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

  /**
   * copies displayed URL into clipboard on click
   */
  function addCopyOnClick(linkDisplay) {
	  var btn = linkDisplay.find('#copyUrlBtn');
    btn.on('click', function(event) {
      /* Get the text field */
      var copyText = linkDisplay.find('#surveyLink');

      /* Select the text field */
      copyText.select();

      /* Copy the text inside the text field */
      document.execCommand("Copy");
    });
  }




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

  $('#inviteParticipants').on('click', function() {

    var coverLetter = $('#coverLetter').val();
    var emails = $('#emailList').text();
    for (mail in emails) {
      mail = mail.replace("remove", "");
    }
    // TODO: send mails
  });

  $('#btnReturn').on('click', function() {
    $(location).attr('href', "/user");
  });


  /**
   * adds the entered mail to the mailing list if its valid
   */
  $('#addMail').on('click', function() {
    if (document.getElementById('mailAddress').checkValidity()) {
      var mails = $('#mailAddress').val();
      // TODO: apply unique checks to single emails, not with ","
      mails = mails.split(",");
      for (var mail in mails) {
        if (checkUnique(mails[mail])) {

          $('#emailList').append(
            '<a class="list-group-item list-group-item-action clearfix">' +
            mails[mail] +
            '<button type="button" name="button" class="rm-on-click pull-right"><span class="glyphicons glyphicons-delete">remove</span></button></a>');

        } else {
          console.log("not a unique email");
        }
      }

    } else {
      console.log("contains invalid email");
    }
  });

  /**
   * toggles the "new link" menu
   */
  $('#btnNewLink, #btnCancelLink').on('click', function() {
    $('#newLinkInputs').slideToggle();
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
  * adds a new link to the survey
  /link
  madatory-parameters: SID
  * optional-parameters: date, uses
  */
  $('#btnCreateLink').on('click', function() {
    if (checkNewLinkInputs()) {
      var expirationDate;
      if ($('#inputExpirationDate').val() != null) {
        expirationDate = $('#inputExpirationDate').val();
      }

      var maxUses;
      if ($('#inputMaxParticipants').val() != null && $('#inputMaxParticipants').val() != 0) {
        maxUses = $('#inputMaxParticipants').val();
      }


      let newLinkData = JSON.stringify({
        SID: SID,
        date: expirationDate,
        uses: maxUses
      });
      console.log("creating new link: " + newLinkData);
      let linkUrl = '/db/link';
      fetch(IP + linkUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          method: 'POST',
          credentials: 'include',
          body: newLinkData
        })
        .then((out) => {
          console.log(out);
          var url = "/db/links";
          var query = "?SID=" + SID;
          fetch(IP + url + query, {
              credentials: 'include'
            })
            .then(res => res.json())
            .then((links) => {
              //adds the new survey link to the list be getting all and taking only the last. not DRY, beware
              var link = links[links.length - 1];
              var newLinkDisplay = $('#linkDisplay').clone(true, true);
              newLinkDisplay.find('#surveyLink').val("http://technikaffinitaet.de/form?inv=" + link.url);
              if (link.expirationDate != null) {
                newLinkDisplay.find('#expiration').css("display", "inherit");
                console.log("expirationDate: " + link.expirationDate);
                newLinkDisplay.find('#expirationDate').append(link.expirationDate);
              }
              if (link.usesLeft != null) {
                newLinkDisplay.find('#limitedUses').css("display", "inherit");
                console.log("usesLeft: " + link.usesLeft);
                newLinkDisplay.find('#usesLeft').append(link.usesLeft);
              }
              addCopyOnClick(newLinkDisplay);
              newLinkDisplay.css("display", "inherit");

              $('#linkContainer').append(newLinkDisplay);

            });
        })
        .catch(err => {
          throw err
        });
    }
  });

  /**
   * gets and displays the survey links
   */
  function displaySurveyLinks(SID) {
    var url = "/db/links";
    var query = "?SID=" + SID;
    fetch(IP + url + query, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then((links) => {
          console.log(links);
          for (link in links) {

            console.log(link + ": " + links[link].url);
            var newLinkDisplay = $('#linkDisplay').clone(true, true);
            newLinkDisplay.find('#surveyLink').val("http://technikaffinitaet.de/form?inv=" + links[link].url);

            if (links[link].expirationDate != null) {
              newLinkDisplay.find('#expiration').css("display", "inherit");
              console.log("expirationDate: " + links[link].expirationDate);
              newLinkDisplay.find('#expirationDate').append(links[link].expirationDate);
            }
            if (links[link].usesLeft != null) {
              newLinkDisplay.find('#limitedUses').css("display", "inherit");
              console.log("usesLeft: " + links[link].usesLeft);
              newLinkDisplay.find('#usesLeft').append(links[link].usesLeft);
            }

            addCopyOnClick(newLinkDisplay);
          newLinkDisplay.css("display", "inherit");
          $('#linkContainer').append(newLinkDisplay);


        }

      })
  .catch(err => {
    throw err
  });
}

/**
 * gets the number of probands and adds it to the display
 */
function displayProbandCount(SID) {
  var url = "/db/countProbandInSurvey";
  var query = "?SID=" + SID;
  fetch(IP + url + query, {
      credentials: 'include'
    })
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
  fetch(IP + url + query, {
      credentials: 'include'
    })
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
  fetch(IP + url + query, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then((std) => {
      $('#atiStd').append(std[0].stdatiScore);
    })
    .catch(err => {
      throw err
    });
}

function checkNewLinkInputs() {
  // TODO: implement
  return true;
}

});
