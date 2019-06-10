// distinction: text is floated the opposite direction of the graph,
// while questions do not float in either direction to stay centered

/* makes text a popup on hover of a another element
    params - hoverid (id of desired trigger element)
           - popupid (id of desired popup text (far side of graph))
           - question id (id of desired question (between popup & graph))
*/
function makePopupText(hoverid, popupid, questionid) {
    //adding listeners for mouseover of hovered object
    document.getElementById(hoverid).addEventListener("mouseover", showPopup);
    document.getElementById(hoverid).addEventListener("mouseover", showQuestion);
    document.getElementById(hoverid).addEventListener("mouseover", makeWidthPermanent);
    
    //removed this line so popups no longer close
    //document.getElementById(hoverid).addEventListener("mouseout", closePopup);

    // shows the element identified by popup id (on hoverid element mouse over)
    function showPopup() {
        //showing the text
        document.getElementById(popupid).style.display = "inline-block";
        
        // if the parent is floated right, float left, or vice versa
        if(document.getElementById(hoverid).style.float == "right") {
            document.getElementById(popupid).style.float = "left";
        } else {
            document.getElementById(popupid).style.float = "right";
        } // if-else
        
    } // showPopup
    
    // shows the element identified by question id (on hoverid element mouse over)
    // after the graph area extends its width
    function showQuestion() {
        //showing the text
        setTimeout(function() {
            document.getElementById(questionid).style.display = "inline-block";
        }, 1000);
        
    } // showQuestion

    // closes the element identified by popup id (on hoverid element mouse out)
    function closePopup() {
        document.getElementById(popupid).style.display = "none";
    } // closePopup
    
    // makes the hovered element's width stay extended
    function makeWidthPermanent() {
    document.getElementById(hoverid).classList.add("holdhover");
    } // makeWidthPermanent
} // makePopupText

