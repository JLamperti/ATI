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