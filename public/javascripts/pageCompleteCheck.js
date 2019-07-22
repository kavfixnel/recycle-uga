// checks to see if all forms are filled (for preSurveyPage)
function checkIfCompletePreSurvey() {
    // counts the total amount of forms completed (if all, should be 8 at end)
    var finishedFormCount = 7;
    
    if(document.getElementsByName('name')[0].value.length > 0) 
        finishedFormCount++;
    
    if(document.getElementsByName('email')[0].value.length > 0)
        finishedFormCount++;
    
    if(document.getElementsByName('age')[0].value.length > 0)
        finishedFormCount++;
    
    if(document.getElementsByName('why')[0].value.length > 0)
        finishedFormCount++;
    
    // for each t/f question check for active
    for(var i = 1; i <= numQuestions; i++) {
        if(i > 7) {
            if(document.getElementsByName('question' + i.toString())[0].parentElement.classList.contains('active') ||
              document.getElementsByName('question' + i.toString())[1].parentElement.classList.contains('active'))
                        finishedFormCount++;
        } // if t/f question
    } // for each question w/o text form
    
    var checkboxes = document.getElementsByName('where');
    var oneIsChecked = false;
    for(var i = 0; i < checkboxes.length && !oneIsChecked; i++) {
        if(checkboxes[i].checked) {
            finishedFormCount++;
            oneIsChecked = true;
        } // if one is checked
    } // for each checkbox

    if(finishedFormCount === numForms) 
        document.getElementById("nextPage").classList.remove("disabled");
} // checkIfCompletePreSurvey

// checks to see if all forms are filled (for preSurveyPage)
function checkIfCompletePostSurvey() {
    // counts the total amount of forms completed (if all, should be 8 at end)
    var finishedFormCount = 7;

    // checking if length of name input is greater than zero
    if(document.getElementsByName("feedback")[0].value.length > 0)
        finishedFormCount++;

    // for each t/f question check for active
    for(var i = 1; i <= numQuestions; i++) {
        if(i > 7) {
            if(document.getElementsByName('question' + i.toString())[0].parentElement.classList.contains('active') ||
              document.getElementsByName('question' + i.toString())[1].parentElement.classList.contains('active'))
                        finishedFormCount++;
        } // if t/f question
    } // for each question w/o text form

    if(finishedFormCount === numForms) 
        document.getElementById("nextPage").classList.remove("disabled");
} // checkIfCompletePostSurvey

// checks if all questions are answered to enable the next page
// button (for infoPage)
function checkIfCompleteInfo() {
    var answerBlanks = document.getElementsByClassName("answerText");
    var notEmptyCount = 0;

    // counts the amount of filled blanks (should be four to continue)
    for(var i = 1; i <= answerBlanks.length; i++) {
        if(document.getElementById("correct" + i.toString()).style.color === "green")
            notEmptyCount++;
    } // for each answer section

    if(notEmptyCount === 4)
        document.getElementById("nextPage").classList.remove("disabled");
} // checkIfCompleteInfo