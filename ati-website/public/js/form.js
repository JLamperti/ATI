var reqAge = true,
  reqSex = true,
  reqEdu = true,
  dumpData = false;
var urlParams = new URLSearchParams(window.location.search);

let invLink = urlParams.get("inv");
var abc = [];

if (invLink != null || invLink != undefined) {
  url = "/db/surveyAndLinkByUrl?url=" + invLink;
  //url = "/db/surveyAndLinkByUrl?url=" + invLink;
  fetch(url)
    .then(res => res.json())
    .then(out => {
      var r = {};
      deleteDumbData();
      dumpData = true;
      reqAge = out[0].takeAge.data[0] === 1 ? true : false;
      reqSex = out[0].takeSex.data[0] === 1 ? true : false;
      reqEdu = out[0].takeEducation.data[0] === 1 ? true : false;
      reqAge === false ? deleteAge() : "";
      reqSex === false ? deleteSex() : "";
      reqEdu === false ? deleteEdu() : "";
      reqEdu && reqSex && reqAge
        ? document.getElementById("sepDiv").remove()
        : "";
    })
    .catch(err => {
      throw err;
    });

  function deleteAge() {
    document.querySelector("#age").remove();
  }
  function deleteSex() {
    document.querySelector("#sex").remove();
  }
  function deleteEdu() {
    document.querySelector("#education").remove();
  }
  function deleteDumbData() {
    document.getElementById("dontSendDataDiv").remove();
  }
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
    invalidInput("#bday");
  }
}
function calculateScore() {
  let res =
    parseInt(document.querySelector('input[name="q1"]:checked').value) +
    parseInt(document.querySelector('input[name="q2"]:checked').value) +
    parseInt(document.querySelector('input[name="q3"]:checked').value) +
    parseInt(document.querySelector('input[name="q4"]:checked').value) +
    parseInt(document.querySelector('input[name="q5"]:checked').value) +
    parseInt(document.querySelector('input[name="q6"]:checked').value) +
    parseInt(document.querySelector('input[name="q7"]:checked').value) +
    parseInt(document.querySelector('input[name="q8"]:checked').value) +
    parseInt(document.querySelector('input[name="q9"]:checked').value);

  let res2 = res / 9;
  return Math.round(res2 * 100) / 100;
}
function checkAnswers() {
  if (isValid()) {
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
      b.inv = invLink;
      $.post("/db/probandLink", b);
      //console.log("probandLink");
    } else {
      if (!dumpData) {
        // $.post("/db/proband", b);
      }
      //console.log("proband");
    }
  }
}

function checkRadio(i, num) {
  document.querySelectorAll('input[name="' + i + '"]')[num].checked = true;
}

function showResult() {
  if (isValid()) {
    document.getElementById("defC").classList.add("highlighted-scale");
    document.getElementById("defC").classList.remove("bg-color-theme");
    document.querySelector("#questionnaireMain").style.display = "none";
    document.querySelector("#questionnaireResult").style.display = "block";
  }
}
var isValid = function() {
  let res = false;
  let quest1 =
    document.querySelector('input[name = "q1"]:checked') != null ? true : false;
  let quest2 =
    document.querySelector('input[name = "q2"]:checked') != null ? true : false;
  let quest3 =
    document.querySelector('input[name = "q3"]:checked') != null ? true : false;
  let quest4 =
    document.querySelector('input[name = "q4"]:checked') != null ? true : false;
  let quest5 =
    document.querySelector('input[name = "q5"]:checked') != null ? true : false;
  let quest6 =
    document.querySelector('input[name = "q6"]:checked') != null ? true : false;
  let quest7 =
    document.querySelector('input[name = "q7"]:checked') != null ? true : false;
  let quest8 =
    document.querySelector('input[name = "q8"]:checked') != null ? true : false;
  let quest9 =
    document.querySelector('input[name = "q9"]:checked') != null ? true : false;
  let elem = document.getElementsByName("first-letter-birthplace")[0].value;
  let firstBP = elem.length == 1 ? true : false;

  let lastBP =
    document.getElementsByName("last-letter-birthplace")[0].value.length == 1
      ? true
      : false;
  let country =
    document.getElementsByName("country")[0].value.length == 2 ? true : false;
  let letterMother =
    document.getElementsByName("father")[0].value.length == 1 ? true : false;
  let letterFather =
    document.getElementsByName("mother")[0].value.length == 1 ? true : false;
  let birthday =
    document.getElementsByName("birthday")[0].value.length == 2 &&
    document.getElementsByName("birthday")[0].value < 32 &&
    document.getElementsByName("birthday")[0].value > 0
      ? true
      : false;

  let age;
  let edu;
  let sex;
  if (reqAge) {
    age =
      document.getElementsByName("age")[0].value.length >= 1 &&
      document.getElementsByName("age")[0].value < 150 &&
      document.getElementsByName("age")[0].value > 0
        ? true
        : false;
  } else {
    age = true;
  }
  if (reqEdu) {
    edu =
      document.querySelector('input[name="edu"]:checked') != null
        ? true
        : false;
  } else {
    edu = true;
  }
  if (reqSex) {
    sex =
      document.querySelector('input[name="sex"]:checked') != null
        ? true
        : false;
  } else {
    sex = true;
  }

  let res1 = quest1 && quest2 && quest3 && quest4 && quest5;
  let res2 = quest6 && quest7 && quest8 && quest9;
  let res3 =
    firstBP && lastBP && country && letterMother && letterFather && birthday;
  let res4 = age && edu && sex;
  res = res1 && res2 && res3 && res4;
  return res;
};

function defaultSetup() {
  let radios = document.querySelectorAll('input[type="radio"]');
  for (i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }
  let inputText = document.querySelectorAll('input[type="text"]');
  for (i = 0; i < inputText.length; i++) {
    inputText[i].value = "";
  }
  let inputNumber = document.querySelectorAll('input[type="number"]');
  for (i = 0; i < inputNumber.length; i++) {
    inputNumber[i].value = "";
  }
}


function dntSend(){ 
  document.querySelector('input[name="dontSendData"]').checked === true ? document.querySelector('input[name="dontSendData"]').checked = false : document.querySelector('input[name="dontSendData"]').checked = true;
}