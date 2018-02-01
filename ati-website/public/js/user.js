$(document).ready(function() {
  var SID = 1;
  var IP = "";
  /**
   * Loads User Info
   */
  var url = IP + "/db/user/?UID=1";
  fetch(url)
    .then(res => res.json())
    .then((out) => {
      $('#nameValue').html(out[0].userName);
      $('#emailValue').html(out[0].eMail);
      var hasTitle;
      var scientist = "Scientist";
      var developer = "Developer";
      var teacher = "Teacher";
      if (out[0].IsScientist.data[0]) {
        $('#titleValue').append(scientist)
        hasTitle = true;
      }
      if (out[0].IsDeveloper.data[0]) {
        if (hasTitle) {
          $('#titleValue').append(", ");
        }
        $('#titleValue').append(developer);
        hasTitle = true;
      }
      if (out[0].IsTeacher.data[0]) {
        if (hasTitle) {
          $('#titleValue').append(", ");
        }
        $('#titleValue').append(Teacher);
      }
    })
    .catch(err => {
      throw err
    });

  /**
   * Loads Survey Info
   * TODO: move to  first req so everything gets called at once
   */
    var url = IP + "/db/surveyByUser?UID=1";
    fetch(url)
      .then(res => res.json())
      .then((out) => {
        $('#openSurveysAmount').html("(" + out.length + ")");
        for (x in out) {

          let newSurveyDisplay = $('#dummySurvey').clone(true, true);

          displayProbandCount(out[x].SurveyID, newSurveyDisplay);
          displayAtiStd(out[x].SurveyID, newSurveyDisplay);
          displayAvgAti(out[x].SurveyID, newSurveyDisplay);
          newSurveyDisplay.attr("id", "survey" + x);
          newSurveyDisplay.find('#surveyName').append(out[x].SurveyName);
          newSurveyDisplay.find('#beginDate').append(out[x].SurveyBegin);
          newSurveyDisplay.find('#endDate').append(out[x].SurveyEnd);
          if (out[x].SurveyEnd != null) {
            newSurveyDisplay.find('#periodEndText').css("display", "inline");
          }

          newSurveyDisplay.find('#participantsTotal').append(out[x].MaxProbands);
          if (out[x].MaxProbands != null) {
            newSurveyDisplay.find('#participantTextMiddle').css("display", "inherit");
          }
          newSurveyDisplay.find('#status').append(out[x].SurveyStatus);
          newSurveyDisplay.css("display", "inherit");
          newSurveyDisplay.appendTo('#resultsArea');

        }
      })
      .catch(err => {
        throw err
      });



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


  $(".surveyField").on('click', function() {

    var arrowItem = $(this).find('#toggleDetailsArrow')
    if (arrowItem.hasClass("glyphicon-menu-up")) {
      arrowItem.addClass("glyphicon-menu-down");
      arrowItem.removeClass("glyphicon-menu-up");
    } else {
      arrowItem.addClass("glyphicon-menu-up");
      arrowItem.removeClass("glyphicon-menu-down");
    }
    $(this).find("#details").slideToggle();
  });

  function displayProbandCount(SID, element) {
    var url = "/db/countProbandInSurvey";
    var query = "?SID=" + SID;
    console.log("gettingProbCnt" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((countProbandInSurvey) => {
        console.log("got prb cnt: " + IP + url + query + ": " + countProbandInSurvey[0].count);
        element.find('#participantsCurrent').append(countProbandInSurvey[0].count);
      })
      .catch(err => {
        throw err
      });
  }

  function displayAvgAti(SID, element) {
    var url = "/db/avg?sel[0]=atiScore&fromSurv=";
    var query = "?sel[0]=atiScore&fromSurv=" + SID;
    console.log("gettingAvgATI" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((avgAtiScore) => {

        console.log("got avg ATI: " + IP + url + query + ": " + avgAtiScore[0].avgatiScore);
        element.find('#avgAtiScore').append(avgAtiScore[0].avgatiScore);
      })
      .catch(err => {
        throw err
      });
  }

  function displayAtiStd(SID, element) {
    var url = "/db/std";
    var query = "?SID=" + SID;
    console.log("gettingAtiStd" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((std) => {
        console.log("got ATI STD: " + IP + url + query + ": " + std[0].stdatiScore);
        element.find('#atiStd').append(std[0].stdatiScore);
      })
      .catch(err => {
        throw err
      });
  }



});

function checkInputs() {
  //check if input values are valid here
  return false;

}


/*text notes:
offen als zeitraum: von ... (bis ...)
from ... (to ...)
teilnehmer: X (von Y)
X (out of Y)
Status: open/closed
*/
