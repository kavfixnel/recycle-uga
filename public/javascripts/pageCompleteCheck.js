// checks to see if all forms are filled (for preSurveyPage)
function checkIfCompletePreSurvey() {
    // counts the total amount of forms completed (if all, should be 8 at end)
    var finishedFormCount = 0;

    // checking if length of name input is greater than zero
    if(document.getElementById("name").value.length > 0)
        finishedFormCount++;

    for(var qCount = 1; qCount <= numQuestions; qCount++) {
        var currentAnswers = document.getElementsByName("question" + qCount.toString());

        for(var i = 0; i < currentAnswers.length; i++) {
            if(currentAnswers[i].checked) {
                finishedFormCount++;
                break;
            } // if one of the answer choices is checked

        } // for each answer in the current question
    } // for each question

    if(finishedFormCount === numForms) 
        document.getElementsByClassName("nextPageButton").item(0).classList.remove("disabled");
} // checkIfCompletePreSurvey

// checks if all questions are answered to enable the next page
// button (for infoPage)
function checkIfCompleteInfo() {
    var answerBlanks = document.getElementsByClassName("answerText");
    var notEmptyCount = 0;

    // counts the amount of filled blanks (should be four to continue)
    for(var i = 0; i < answerBlanks.length; i++) {
        if(answerBlanks[i].value.length > 0)
            notEmptyCount++;
    } // for each answer section

    if(notEmptyCount >= 4)
        document.getElementsByClassName("nextPageButton").item(0).classList.remove("disabled");

} // checkIfCompleteInfo