// makeGraph - creates and renders a graph based on the element's id,
// title, graph type, and data
// has constant theme, animationEnabled, startAngle, format, and indices
function makeGraph(id, name, type, dataPoints) {
        var graph = new CanvasJS.Chart(id, {
            theme: "light1",
            animationEnabled: true,
            backgroundColor: "#f3efee",
            title: {
                text: name
            },
            data: [{
                type: type,
                startAngle: 180,
                indexLabelFontSize: 7,
                yValueFormatString: "##0.00\"%\"",
                dataPoints: dataPoints
            }] // data 
        }); // graph

        graph.render();
    } // makeGraph