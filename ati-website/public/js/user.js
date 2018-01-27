$(document).ready(function() {

  /**
   * Loads User Info
   */
  var url = "http://87.146.253.216:3000/db/user/?UID=1";
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
  $('#testButton').on('click', function() {
    var url = "http://87.146.253.216:3000/db/surveyByUser?UID=1";
    fetch(url)
      .then(res => res.json())
      .then((out) => {
        $('#openSurveysAmount').html("(" + out.length + ")");
        var cloneCount = 1;
        for (x in out) {
          var newID = "survey" + x;
          var newSurveyDisplay = $('#dummySurvey').clone(true, true);
          //fixIds(newSurveyDisplay, x);
          newSurveyDisplay.find('#SurveyName').append(out[x].SurveyName);
          newSurveyDisplay.find('#beginDate').append(out[x].SurveyBegin);
          newSurveyDisplay.find('#endDate').append(out[x].SurveyEnd);
          if (out[x].SurveyEnd != null) {
            newSurveyDisplay.find('#periodEndText').css("display", "inherit");
          }
          /*var url = "http://87.146.253.216:3000/db/countProbandInSurvey?SID=" + out[x].SurveyID;
          fetch(url)
            .then(res => res.json())
            .then((out) => {
              newSurveyDisplay.find('#participantscurrent').append(out[0].length);
            })
            .catch(err => {
              throw err
            });
            */
          newSurveyDisplay.find('#participantscurrent').append(out[x].SurveyBegin);
          newSurveyDisplay.find('#participantsTotal').append(out[x].MaxProbands);
          if (out[x].MaxProbands != null) {
            newSurveyDisplay.find('#participantTextMiddle').css("display", "inherit");
          }
          newSurveyDisplay.find('#status').append(out[x].SurveyStatus);
          newSurveyDisplay.css("display", "inherit");
          newSurveyDisplay.appendTo('#resultsArea');

          // /db/avg?sel[0]=atiScore&fromSurv=X
        }
        console.log(out);
      })
      .catch(err => {
        throw err
      });

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


  $(".uparrow").click(function() {
    /*TODO: toggle via parents, not IDs */
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


/*text notes:
offen als zeitraum: von ... (bis ...)
from ... (to ...)
teilnehmer: X (von Y)
X (out of Y)
Status: open/closed
*/
