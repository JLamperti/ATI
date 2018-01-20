//Tag
//num != char
function checkForBirthday(field) {
  
  let valid =
    document.querySelector('input[name="' + field.name + '"]').value.length == 2
      ? checkInputNumber(
          document.querySelector('input[name="' + field.name + '"]').value
        )
      : invalidInput('#bday');

}
function invalidInput(elem) {
  document.querySelector("" +elem).classList.add("invalid-input");
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
  if (checkZeroInfront(val) || val[0] == "1" ||val[0] == "2" || val[0] == "3") {
    document.querySelector("#bday").classList.remove("invalid-input");
    return true;
  } else {
    invalidInput();
  }
}

function checkAnswers(){
  // let quest1 = document.querySelector('input[name="q1"]').checked ? validAnswer('#q1') : invalidInput('#q1') ;
  console.log('aa');
}

function checkRadio(i,num){
  console.log(document.querySelectorAll('input[name="' +i+'"]')[num]);
  document.querySelectorAll('input[name="' +i+'"]')[num].checked = true;
}