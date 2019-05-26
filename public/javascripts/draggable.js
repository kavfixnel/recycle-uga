// makes an element draggable by passing in the element
function makeDraggable(element) {
    var differenceX = 0, differenceY = 0, startX = 0, startY = 0;
    element.onmousedown = dragMouseDown;

    // on click of a draggable element
    function dragMouseDown(e) {                
        e = e || window.event;
        e.preventDefault();

        // get starting location of element
        startX = e.clientX;
        startY = e.clientY;

        // on mouse up, stop, on move, drag
        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
    }

    // moves an element that is draggable
    function dragElement(e) {
        e = e || window.event;
        e.preventDefault();

        differenceX = startX - e.clientX;
        differenceY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;

        element.style.left = (element.offsetLeft - differenceX) + "px";
        element.style.top = (element.offsetTop - differenceY) + "px";
    }

    // stops an element from dragging
    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
        
        checkObjectForDropTargets();
    } // stopDragging
    
    //when the object is dropped, check if it intersects with
    //the desired bins for the game
    function checkObjectForDropTargets() {
        
        // get rectangle x/y coordinates for element targets
        var paperBin = document.getElementById("paperbin");
        var plasticBin = document.getElementById("plasticbin");
        var glassBin = document.getElementById("glassbin");
        var metalBin = document.getElementById("metalbin");
        var trashCan = document.getElementById("trashcan");
        
        var targets = [paperBin, plasticBin, glassBin, metalBin, trashCan];
        
        var doesOverlap;
        
        for(var target in targets) {
            
            doesOverlap = isOverlapping(element, target);
            
            if(doesOverlap) {
                break;
            }
        }
        
        if(doesOverlap) {
            element.style.display = "none";
        }
        
    } // checkObjectForDropTargets
} // makeDraggable