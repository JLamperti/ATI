function checkradio(q, selAnsw) {
  for (i = 1; i < 7; i++) {
    document.getElementById(q + "Answer" + i).checked = false;
  }
  document.getElementById(q + "Answer" + selAnsw).checked = true;
}

function uncheckall() {
  //uncheck question 1 to 9
  for (n = 1; n < 10; n++) {
    for (i = 1; i < 7; i++) {
      document.getElementById(n + "Answer" + i).checked = false;
    }
  }
  //uncheck gender
  document.getElementById("female").checked = false;
  document.getElementById("male").checked = false;

  //uncheck education
  document.getElementById("lesserThanAbitur").checked = false;
  document.getElementById("BMD").checked = false;
  document.getElementById("aLevel").checked = false;
  document.getElementById("hMD").checked = false;
  document.getElementById("age").value = 0;

  document.getElementById("letMother").value = "";
  document.getElementById("numMonth").value = 0;
  document.getElementById("letPlace").value = "";
}

function checkGender(gender) {
  if (gender == "male") {
    document.getElementById("female").checked = false;
  } else {
    document.getElementById("male").checked = false;
  }
  document.getElementById(gender).checked = true;
}

function checkEducation(ed) {
  document.getElementById("lesserThanAbitur").checked = false;
  document.getElementById("BMD").checked = false;
  document.getElementById("aLevel").checked = false;
  document.getElementById("hMD").checked = false;
  document.getElementById(ed).checked = true;
}

function createUniqueId() {
  let tempMother = document.getElementById("letMother").value;
  let tempMonth = document.getElementById("numMonth").value;
  let tempPlace = document.getElementById("letPlace").value;
  if (tempMother.length == 3) {
    tempMother = invalidNumbers(1, "letMother", "descMother");
  } else {
    tempMonth = invalidNumbers(0, "descMother", 0);
  }
  if (tempMonth > 0 && tempMonth < 13) {
    tempMonth = invalidNumbers(1, "numMonth", "descMonth");
  } else {
    tempMonth = invalidNumbers(0, "descMonth", 0);
  }
  if (tempPlace.length == 1) {
    tempPlace = invalidNumbers(1, "letPlace", "descPlace");
  } else {
    tempPlace = invalidNumbers(0, "descPlace", 0);
  }
  if (
    tempMother.length == 3 &&
    tempMonth >= 1 &&
    tempMonth <= 12 &&
    tempPlace.length == 1
  ) {
    let uId = tempMother.concat(tempMonth.toString());
    let res = uId.concat(tempPlace);
    return res;
  } else {
    return null;
  }
}

function createUniqueAnswers() {
  let answers = [];
  qa =
    document.querySelector('input[name = "one"]:checked') != null
      ? inValidAnswers(1, "one", "q1")
      : inValidAnswers(0, "q1", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "two"]:checked') != null
      ? inValidAnswers(1, "two", "q2")
      : inValidAnswers(0, "q2", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "three"]:checked') != null
      ? inValidAnswers(1, "three", "q3")
      : inValidAnswers(0, "q3", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "four"]:checked') != null
      ? inValidAnswers(1, "four", "q4")
      : inValidAnswers(0, "q4", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "five"]:checked') != null
      ? inValidAnswers(1, "five", "q5")
      : inValidAnswers(0, "q5", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "six"]:checked') != null
      ? inValidAnswers(1, "six", "q6")
      : inValidAnswers(0, "q6", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "seven"]:checked') != null
      ? inValidAnswers(1, "seven", "q7")
      : inValidAnswers(0, "q7", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "eight"]:checked') != null
      ? inValidAnswers(1, "eight", "q8")
      : inValidAnswers(0, "q8", 0);
  answers.push(qa);
  qa =
    document.querySelector('input[name = "nine"]:checked') != null
      ? inValidAnswers(1, "nine", "q9")
      : inValidAnswers(0, "q9", 0);
  answers.push(qa);
  return answers;
}

function inValidAnswers(action, id, remove) {
  //0 for invalid input
  if (action == 0) {
    document.getElementById(id).classList.add("invalidInput");
    return null;
  } else if (action == 1) {
    let elem = document.getElementById(remove);
    elem.classList.contains("invalidInput")
      ? elem.classList.remove("invalidInput")
      : "";
    return document.querySelector("input[name =" + id + "]:checked").value;
  }
  //1 for valid input
}

function invalidNumbers(action, id, remove) {
  if (action == 0) {
    document.getElementById(id).classList.add("invalidInput");
    return null;
  } else if (action == 1) {
    let elem = document.getElementById(remove);
    elem.classList.contains("invalidInput")
      ? elem.classList.remove("invalidInput")
      : "";
    return document.getElementById(id).value;
  }
}

function createUniqueDemographicData() {
  let demographicData = [];
  let d =
    document.querySelector('input[name = "gender"]:checked') != null
      ? inValidAnswers(1, "gender", "sex")
      : inValidAnswers(0, "sex", 0);
  demographicData.push(d);
  d =
    document.getElementById("age").value > 0
      ? invalidNumbers(1, "age", "descAge")
      : invalidNumbers(0, "descAge", 0);
  demographicData.push(d);
  d =
    document.querySelector('input[name = "education"]:checked') != null
      ? inValidAnswers(1, "education", "edu")
      : inValidAnswers(0, "edu", 0);
  demographicData.push(d);

  return demographicData;
}

function submitForm() {
  let valid = false;
  var result = {
    id: createUniqueId(),
    answers: createUniqueAnswers(),
    atiScore: 0,
    demographicData: createUniqueDemographicData()
  };

  let resId = true;
  if (result.id == null) {
    resId = false;
  }
  let resAns = true;
  for (i = 0; i < result.answers.length; i++) {
    if (result.answers[i] == null) {
      return (resAns = false);
    }
  }

  if (resAns) {
    let score = parseInt(result.answers[0])+parseInt(result.answers[1])+parseInt(result.answers[2])+parseInt(result.answers[3])+parseInt(result.answers[4])+parseInt(result.answers[5])+parseInt(result.answers[6])+parseInt(result.answers[7])+parseInt(result.answers[8]);
    console.log(score);
    let res = score / 9;
    result.atiScore = res;
  }

  let resDem = true;
  for (i = 0; i < result.demographicData.length; i++) {
    if (result.demographicData[i] == null) {
      return (resDem = false);
    }
  }

  if (resId != false && resAns != false && resDem != false) {
    console.log(result);
    let b = {
      Token: result.id,
      Ati1: result.answers[0],
      Ati2: result.answers[1],
      Ati3: result.answers[2],
      Ati4: result.answers[3],
      Ati5: result.answers[4],
      Ati6: result.answers[5],
      Ati7: result.answers[6],
      Ati8: result.answers[7],
      Ati9: result.answers[8],
      AtiScore: result.atiScore,
      Sex: result.demographicData[0],
      Age: result.demographicData[1],
      Education: result.demographicData[2]
    };
    // let newFormRequest = new Request(insertProband, {method: 'POST', body: b});
    let params = jQuery.param(b);
    console.log("object:  " + b);
    console.log(params);
    $.post("/db/proband", b);
  }
}
