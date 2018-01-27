var reqAge = true,
  reqSex = true,
  reqEdu = true;
var urlParams = new URLSearchParams(window.location.search);

let invLink = urlParams.get("inv");
var abc = [];
url = "/db/surveyAndLinkByUrl?url=" + invLink;
fetch(url)
  .then(res => res.json())
  .then(out => {
    console.log("output" + out);
    var r = {};
    reqAge = out[0].takeAge.data[0] === 1 ? true : false;
    reqSex = out[0].takeSex.data[0] === 1 ? true : false;
    reqEdu = out[0].takeEducation.data[0] === 1 ? true : false;
    reqAge === false ? deleteAge() : '';
    reqSex === false ? deleteSex() : '';
    reqEdu === false ? deleteEdu() : '';
  })
  .catch(err => {
    throw err;
  });

  function deleteAge(){
    document.querySelector('#age').remove();
  }
  function deleteSex(){
    document.querySelector('#sex').remove();
  }
  function deleteEdu(){
    document.querySelector('#education').remove();
  }

var b = {};
function checkForBirthday(field) {
  let valid =
    document.querySelector('input[name="' + field.name + '"]').value.length == 2
      ? checkInputNumber(
          document.querySelector('input[name="' + field.name + '"]').value
        )
      : invalidInput("#bday");
}
function invalidInput(elem) {
  document.querySelector("" + elem).classList.add("invalid-input");
  return false;
}
function checkZeroInfront(val) {
  if (val[0] == "0" && parseInt(val[1]) > 0) {
    return true;
  } else {
    return false;
  }
}
function checkInputNumber(val) {
  if (
    checkZeroInfront(val) ||
    val[0] == "1" ||
    val[0] == "2" ||
    val[0] == "3"
  ) {
    document.querySelector("#bday").classList.remove("invalid-input");
    return true;
  } else {
    invalidInput();
  }
}
function calculateScore() {
  return Math.round(
    (parseInt(document.querySelector('input[name="q1"]:checked').value) +
      parseInt(document.querySelector('input[name="q2"]:checked').value) +
      parseInt(document.querySelector('input[name="q3"]:checked').value) +
      parseInt(document.querySelector('input[name="q4"]:checked').value) +
      parseInt(document.querySelector('input[name="q5"]:checked').value) +
      parseInt(document.querySelector('input[name="q6"]:checked').value) +
      parseInt(document.querySelector('input[name="q7"]:checked').value) +
      parseInt(document.querySelector('input[name="q8"]:checked').value) +
      parseInt(document.querySelector('input[name="q9"]:checked').value)) /
      9
  ).toFixed(1);
}
function checkAnswers() {
  var score = calculateScore();
  document.getElementById("uSc").innerHTML = " " + score + " ";

  b = {
    Token:
      document.querySelector('input[name="first-letter-birthplace"]').value +
      document.querySelector('input[name="last-letter-birthplace"]').value +
      document.querySelector('input[name="birthday"]').value +
      document.querySelector('input[name="country"]').value +
      document.querySelector('input[name="father"]').value +
      document.querySelector('input[name="mother"]').value,
    Ati1: document.querySelector('input[name="q1"]:checked').value,
    Ati2: document.querySelector('input[name="q2"]:checked').value,
    Ati3i: document.querySelector('input[name="q3"]:checked').value,
    Ati4: document.querySelector('input[name="q4"]:checked').value,
    Ati5: document.querySelector('input[name="q5"]:checked').value,
    Ati6i: document.querySelector('input[name="q6"]:checked').value,
    Ati7: document.querySelector('input[name="q7"]:checked').value,
    Ati8i: document.querySelector('input[name="q8"]:checked').value,
    Ati9: document.querySelector('input[name="q9"]:checked').value,
    AtiScore: score
  };
  if (reqAge) {
    b.Sex = document.querySelector('input[name="sex"]:checked').value;
  }
  if (reqSex) {
    b.Age = document.querySelector('input[name="age"]').value;
  }
  if (reqEdu) {
    b.Education = document.querySelector('input[name="edu"]:checked').value;
  }

  var urlParams = new URLSearchParams(window.location.search);

  let invLink = urlParams.get("inv");
  if (urlParams.has("inv")) {
    $.post("/db/probandLink", b);
    b.inv = invLink;

  } else {
    $.post("/db/proband", b);
 
  }
}

function checkRadio(i, num) {
  document.querySelectorAll('input[name="' + i + '"]')[num].checked = true;
}

function showResult() {
  document.querySelector("#questionnaireMain").style.display = "none";
  document.querySelector("#questionnaireResult").style.display = "block";
}
