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
    } // stopDragging
} // makeDraggable