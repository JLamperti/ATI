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
    var status = ($('#enableMaxProbands').is(':checked'))? 'open':'closed';
    var takeAge = $('#takeAge').val();
    var takeSex = $('#takeSex').val();
    var takeEducation = $('#takeEducation').val();
    var description = $('#description').val();
    if ($('#enableMaxProbands').is(':checked')) {
      var MaxProbands = $('#MaxProbands').val();
    }

    let newSurveyData = JSON.stringify({
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

    let url = '/db/survey';
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
      })
      .catch(err => {
        throw err
      });


    /**
     *redirect to surveyDetails
     */
    //window.location.hostname
    //window.location.pathname;
    // TODO: assign new SID
    SID = 1;
    window.location.href = "/user/surveyDetails";

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
