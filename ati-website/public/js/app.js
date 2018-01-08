

function checkCheckbox(q, selAnsw) {
    for (i = 1; i < 7; i++) {
        document.getElementById(q + 'Answer' + i).checked = false;
    }
    document.getElementById(q + 'Answer' + selAnsw).checked = true;

}

function uncheckall() {
    //uncheck question 1 to 9
    for (n = 1; n < 10; n++) {
        for (i = 1; i < 7; i++) {
            document.getElementById(n + 'Answer' + i).checked = false;
        }
    }
    //uncheck gender
    document.getElementById('female').checked = false;
    document.getElementById('male').checked = false;

    //uncheck education
    document.getElementById('lesserThanAbitur').checked = false;
    document.getElementById('BMD').checked = false;
    document.getElementById('aLevel').checked = false;
    document.getElementById('hMD').checked = false;
    document.getElementById('age').value = 0


    document.getElementById('letMother').value = '';
    document.getElementById('numMonth').value = 0
    document.getElementById('letPlace').value = '';
}

function checkGender(gender) {
    if (gender == 'male') {
        document.getElementById('female').checked = false;
    } else {
        document.getElementById('male').checked = false;
    }
    document.getElementById(gender).checked = true;
}

function checkEducation(ed) {
    document.getElementById('lesserThanAbitur').checked = false;
    document.getElementById('BMD').checked = false;
    document.getElementById('aLevel').checked = false;
    document.getElementById('hMD').checked = false;
    document.getElementById(ed).checked = true;
}

function createUniqueId() {
    let tempMother = document.getElementById('letMother').value;
    let tempMonth = document.getElementById('numMonth').value.toString();
    let tempPlace = document.getElementById('letPlace').value;
    if (tempMother.length == 3 && tempMonth.length == 2 && tempMonth[0] >= 0 && tempMonth[0] <= 1 && tempMonth[1] >= 0 && tempMonth[1] <= 9 && tempPlace.length == 1) {
        let uId = tempMother.concat(tempMonth);
        let res = uId.concat(tempPlace);
        return res;
    }
}

function createUniqueAnswers() {
    let answers = {
        qa1: document.querySelector('input[name = "one"]:checked') != null ? document.querySelector('input[name = "one"]:checked').value : alert('nothing selected  at the first question'),
        qa2: document.querySelector('input[name = "two"]:checked') != null ? document.querySelector('input[name = "two"]:checked').value : alert('nothing selected  at the second question'),
        qa3: document.querySelector('input[name = "three"]:checked') != null ? document.querySelector('input[name = "three"]:checked').value : alert('nothing selected  at the third question'),
        qa4: document.querySelector('input[name = "four"]:checked') != null ? document.querySelector('input[name = "four"]:checked').value : alert('nothing selected  at the fourth question'),
        qa5: document.querySelector('input[name = "five"]:checked') != null ? document.querySelector('input[name = "five"]:checked').value : alert('nothing selected  at the fifth question'),
        qa6: document.querySelector('input[name = "six"]:checked') != null ? document.querySelector('input[name = "six"]:checked').value : alert('nothing selected  at the sixth question'),
        qa7: document.querySelector('input[name = "seven"]:checked') != null ? document.querySelector('input[name = "seven"]:checked').value : alert('nothing selected  at the seventh question'),
        qa8: document.querySelector('input[name = "eight"]:checked') != null ? document.querySelector('input[name = "eight"]:checked').value : alert('nothing selected  at the eigth question'),
        qa9: document.querySelector('input[name = "nine"]:checked') != null ? document.querySelector('input[name = "nine"]:checked').value : alert('nothing selected  at the nineth question')
    }
    return answers;
}

function createUniqueDemographicData() {
    let demographicData = {
        sex: document.querySelector('input[name = "gender"]:checked') != null ? document.querySelector('input[name = "gender"]:checked').value : alert('no gender'),
        age: document.getElementById('age').value,
        education: document.querySelector('input[name = "education"]:checked') != null ? document.querySelector('input[name = "education"]:checked').value : alert('no education level selected')
    }
    return demographicData;
}


function submitForm() {

    var result = {
        id: createUniqueId(),
        answers: createUniqueAnswers(),
        demographicData: createUniqueDemographicData()
    }
    return result;
};