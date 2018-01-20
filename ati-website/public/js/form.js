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
function checkAnswers() {
  var score =
    (document.querySelector('input[name="q1"]:checked').value +
      document.querySelector('input[name="q2"]:checked').value +
      document.querySelector('input[name="q3"]:checked').value +
      document.querySelector('input[name="q4"]:checked').value +
      document.querySelector('input[name="q5"]:checked').value +
      document.querySelector('input[name="q6"]:checked').value +
      document.querySelector('input[name="q7"]:checked').value +
      document.querySelector('input[name="q8"]:checked').value +
      document.querySelector('input[name="q9"]:checked').value) /
    9;
  var b = {
    Token:
      document.querySelector('input[name="first-letter-birthplace"]').value +
      document.querySelector('input[name="last-letter-birthplace"]').value +
      document.querySelector('input[name="birthday"]').value +
      document.querySelector('input[name="country"]').value +
      document.querySelector('input[name="father"]').value +
      document.querySelector('input[name="mother"]').value,
    Ati1: document.querySelector('input[name="q1"]:checked').value,
    Ati2: document.querySelector('input[name="q2"]:checked').value,
    Ati3: document.querySelector('input[name="q3"]:checked').value,
    Ati4: document.querySelector('input[name="q4"]:checked').value,
    Ati5: document.querySelector('input[name="q5"]:checked').value,
    Ati6: document.querySelector('input[name="q6"]:checked').value,
    Ati7: document.querySelector('input[name="q7"]:checked').value,
    Ati8: document.querySelector('input[name="q8"]:checked').value,
    Ati9: document.querySelector('input[name="q9"]:checked').value,
    AtiScore: score,
    Sex: document.querySelector('input[name="sex"]:checked').value,
    Age: document.querySelector('input[name="age"]').value,
    Education: document.querySelector('input[name="edu"]:checked').value
  };
  $.post("/db/proband", b);
}

function checkRadio(i, num) {
  console.log(document.querySelectorAll('input[name="' + i + '"]')[num]);
  document.querySelectorAll('input[name="' + i + '"]')[num].checked = true;
}
