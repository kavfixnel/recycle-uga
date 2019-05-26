/* makes text a popup on hover of a another element
    params - hoverid (id of desired trigger element)
           - popupid (id of desired popup text)
*/
function makePopup(hoverid, popupid) {
    //adding listeners for mouseover, mouseout of hovered object
    document.getElementById(hoverid).addEventListener("mouseover", showPopup);
    document.getElementById(hoverid).addEventListener("mouseout", closePopup);

    // shows the element identified by popup id (on hoverid element mouse over)
    function showPopup() {
        //showing the text
        document.getElementById(popupid).style.display = "block";
        
        // if the parent is floated right, float left, or vice versa
        if(document.getElementById(popupid).parentElement.style.float == "right") {
            document.getElementById(popupid).style.float = "left";
        } else {
            document.getElementById(popupid).style.float = "right";
        } // if-else
        
    } // showPopup

    // closes the element identified by popup id (on hoverid element mouse out)
    function closePopup() {
        document.getElementById(popupid).style.display = "none";
    } // closePopup
} // makePopup