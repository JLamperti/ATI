$(document).ready(function() {
  var IP = "";
  var UID = 1;
  var SID = 1;



  /**
   * Submits form data to server
   */
  $('#submit').on('click', function() {



    var surveyName = $('#surveyName').val();
    var begin = $('#begin').val();
    var end = $('#end').val();
    // TODO: not working properly?
    var status = ($('#closeSurvey').is(':checked')) ? 'closed' : 'open';
    var takeAge = $('#takeAge').val();
    var takeSex = $('#takeSex').val();
    var takeEducation = $('#takeEducation').val();
    var description = $('#description').val();
    if ($('#enableMaxProbands').is(':checked')) {
      var MaxProbands = $('#MaxProbands').val();
    }

    var newSurveyData = JSON.stringify({
      UID: UID,
      Name: surveyName,
      Description: description,
      MaxProbands: MaxProbands,
      Status: status,
      Begin: begin,
      End: end,
      inviteText: description,
      takeEducation: takeEducation,
      takeAge: takeAge,
      takeSex: takeSex
    });

    var url = '/db/survey';
    fetch(IP + url, {
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: newSurveyData
      })
      .then((out) => {
        console.log(out);

        /**
        *redirect to surveyDetails
        */
        //window.location.hostname
        //window.location.pathname;
        // TODO: redirect to new SID
        SID = 1;
        window.location.href = "/user";
      })
      .catch(err => {
        throw err
      });


  });


  /**
   * sets default start date of a survey to today
   */
  $('#begin').val(new Date().toDateInputValue());




});

/**
 *returns timezone-offset date
 */
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});
