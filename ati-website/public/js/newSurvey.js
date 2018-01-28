$(document).ready(function() {

  console.log("starting");
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
});
