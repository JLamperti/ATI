$(document).ready(function() {
  var SID = 1;
  var UID = 1;
  var IP = "";

  /**
   * Loads User Info
   */
  var user;
  var url = "/db/user/";
  console.log("getting user");
  fetch(IP + url)
    .then(res => res.json())
    .then((out) => {
      user = out;
      $('#nameValue').html(out[0].userName);
      $('#emailValue').html(out[0].eMail);
      setTitles(out);
      console.log("got user");
    })
    .catch(err => {
      throw err
    });

  /**
   * Loads Survey Info
   */
  var url = "/db/surveyByUser";
  console.log("getting surveys by user");
  fetch(IP + url)
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
      console.log("got surveys");
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
      $("#nameField").html('<span class="grey text-item-descr">Name</span><input type="text" name="name" value="' + user[0].userName + '"></input>');
      $("#titleField").html('<label><p><input id="isScientist" type="checkbox" name="isScientist" value="Scientist"' + (user[0].IsScientist.data[0]? "checked":"") +'> Scientist </p></label><label><p><input id="isDeveloper"type="checkbox" name="isDeveloper" value="Developer"' + (user[0].IsDeveloper.data[0]? "checked":"") +'> Developer </p></label><label><p><input id="isTeacher" type="checkbox" name="isTeacher" value="Teacher"' + (user[0].IsTeacher.data[0]? "checked":"") +'> Teacher </p></label>');
      $('#emailField').html('<span class="grey text-item-descr">Email</span><input type="email" name="email" value="' + user[0].eMail + '"></input>');
      $('#passwordField').html('<span class="grey text-item-descr">Password</span><input type="password" name="newPassword" placeholder= "leave empty to keep old password"></br></input> <span class="grey text-item-descr"> Confirm Password</span><input type="password" name="confirmPassword"></input>');
    } else {
      //switch back to standard view AND submit data
      var checkedPassword = checkPassword();
      if (checkedPassword == "ok" || checkedPassword == "no password entered") {
        console.log("passwords ok, sumbmitting data");
        el.data("text-original", el.text());
        el.text(el.data("text-swap"));


        var newName = $('#nameField input').val();
        $("#nameField").html("<h2>" + (newName != null? newName : user[0].userName) + "</h2>");
        user[0].userName = newName;


        var isSciCbx = $('#titleField #isScientist');
        user[0].IsScientist.data[0] = (isSciCbx[0].checked? 1 : 0);
        var isDevCbx = $('#titleField #isDeveloper');
        user[0].IsDeveloper.data[0] = (isDevCbx[0].checked? 1 : 0);
        var isTeaCbx = $('#titleField #isTeacher');
        user[0].IsTeacher.data[0] = (isTeaCbx[0].checked? 1 : 0);

        $('#titleField').html('<h3 id="titleValue"></h3>');
        setTitles(user);




        var newEmail = $('#emailField input').val();
        $('#emailField').html('<span class="grey text-item-descr">Email</span><span>' + (newEmail != null? newEmail: user[0].eMail)+ '</span>');
        user[0].eMail = newEmail;
        var newPassword;
        if (checkedPassword == "ok") {
          newPassword = $('#passwordField input').val();
        }
        console.log("newpw = " + newPassword);
        $('#passwordField').html('<span class="grey text-item-descr">Password</span><span>********</span>')


        // mandatory-parameters: UID
        //* optional-parameters: name, email, pw, PID, scientist, developer, teacher
        //'db/user'

        let updatedUserData = JSON.stringify({
          UID: UID,
          name: (newName != null? newName : undefined),
          email: (newEmail != null? newEmail : undefined),
          pw: (newPassword != null? newPassword : undefined),
          scientist: (isSciCbx[0].checked? "1" : "0"),
          developer: (isDevCbx[0].checked? "1" : "0"),
          teacher: (isTeaCbx[0].checked? "1" : "0")
        });
        console.log(updatedUserData);
        let url = '/db/user';
        fetch(IP + url, {
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            method: 'PUT',
            body: updatedUserData
          })
          .then((out) => {
            console.log(out);
          })
          .catch(err => {
            throw err
          });




      }
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
    //console.log("gettingProbCnt" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((countProbandInSurvey) => {
        //console.log("got prb cnt: " + IP + url + query + ": " + countProbandInSurvey[0].count);
        element.find('#participantsCurrent').append(countProbandInSurvey[0].count);
      })
      .catch(err => {
        throw err
      });
  }

  function displayAvgAti(SID, element) {
    var url = "/db/avg?sel[0]=atiScore&fromSurv=";
    var query = "?sel[0]=atiScore&fromSurv=" + SID;
    //console.log("gettingAvgATI" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((avgAtiScore) => {

        //console.log("got avg ATI: " + IP + url + query + ": " + avgAtiScore[0].avgatiScore);
        element.find('#avgAtiScore').append(avgAtiScore[0].avgatiScore);
      })
      .catch(err => {
        throw err
      });
  }

  function displayAtiStd(SID, element) {
    var url = "/db/std";
    var query = "?SID=" + SID;
    // console.log("gettingAtiStd" + IP + url + query);
    fetch(IP + url + query)
      .then(res => res.json())
      .then((std) => {
        //console.log("got ATI STD: " + IP + url + query + ": " + std[0].stdatiScore);
        element.find('#atiStd').append(std[0].stdatiScore);
      })
      .catch(err => {
        throw err
      });
  }


  function setTitles(out) {
    console.log("setting titles");
    var hasTitle;
    var scientist = "Scientist";
    var developer = "Developer";
    var teacher = "Teacher";
    var title = ""
    if (out[0].IsScientist.data[0]) {
      title += scientist;
      hasTitle = true;
    }
    if (out[0].IsDeveloper.data[0]) {
      if (hasTitle) {
        title += ", ";
      }
      title += developer;
      hasTitle = true;
    }
    if (out[0].IsTeacher.data[0]) {
      if (hasTitle) {
        title += ", ";
      }
      title += teacher;
    }
    console.log("titles = " + title);
    $('#titleValue').append(title);

  }


  function checkPassword() {
    //check if input values are valid here
    // TODO: insert password restrictions
    var passwords = $('#passwordField input');
    console.log(passwords);
    console.log("pw1 = " + passwords[0].value + ", pw2 = " + passwords[1].value);
    if (passwords[0].value.length == 0 && passwords[1].value.length == 0) {
      return "no password entered";
    }
    if (passwords[0].value != passwords[1].value) {
      return "passwords not equal";
    }
    if (passwords[0].value.length < 8) {
      return "password not strong enough";
    }
    return "ok";
  }

});



/*text notes:
offen als zeitraum: von ... (bis ...)
from ... (to ...)
teilnehmer: X (von Y)
X (out of Y)
Status: open/closed
*/
