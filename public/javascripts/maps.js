function createMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmVjeWNsZXVnYSIsImEiOiJjanhuZDRrengwZGhzM2NxZGYyczN0cmtxIn0.90gL17oBS0iAABYgzydKtQ';
     console.log('boop');
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-83.400, 33.953],
        zoom: 11.85
    });

    map.on("load", function() {
        map.loadImage("https://i.imgur.com/MK4NUzI.png", function (error, image) {
            if(error) throw error;
            map.addImage("custom-marker", image);
            map.addLayer({
                id: "markers",
                type: "symbol",
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [ // SET OF MARKERS TO GO ON MAP
                            { // marker 1
                                type: 'Feature',
                                properties: {
                                    description: "<strong>Athens-Clarke County Recycling Divison</strong><br>\
                                    725 Hancock Industrial Way, Athens, GA 30605<br><br>\
                                    The ACC recycling division is the perfect place in Athens to recycle traditional items\
                                    in bulk, such as hard plastic, glass, metal cans, cardboard, and mixed paper. For non-traditional items, see CHaRM."
                                },
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.335210, 33.967170]
                                } 
                            }, { // marker 2
                                type: 'Feature',
                                properties: {
                                    description: "<strong>CMC Recycling</strong><br>\
                                    1570, 590 Old Hull Rd, Athens, GA 30601<br><br>\
                                    CMC recycling accepts both ferrous and non-ferrous scrap metals\
                                    as well as items like car batteries, radiators, and auto bodies."
                                },
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.342680, 33.983030]
                                } 
                            }, { // marker 3
                                type: 'Feature',
                                properties: {
                                    description: "<strong>CHaRM (Center for Hard to Recycle Materials)</strong><br>\
                                    1005 College Ave, Athens, GA 30601<br><br>\
                                    CHaRM accepts all kinds of non-traditional recycled materials that can't be recycled\
                                    anywhere else, such as batteries, styrofoam, bulbs, clothing, paint, and books."
                                },
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.377970, 33.969200]
                                } 
                            }, { // marker 4
                                type: 'Feature',
                                properties: {
                                    description: "<strong>Georgia Computer Recycling</strong><br>\
                                    240 Collins Ind Blvd, Athens, GA 30601<br><br>\
                                    Georgia Computer Recycling accepts electronic parts from computers\
                                    and similar technological devices for repurposing and recycling."
                                },
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.359660, 33.979100]
                                } 
                            }, { // marker 5
                                type: 'Feature',
                                properties: {
                                    description: "<strong>Free I.T. Athens</strong><br>\
                                    2465 Jefferson Rd, Athens, GA 30607<br><br>\
                                    Free I.T. Athens is a non-profit organization that accepts various types of technology\
                                    such as computers, printers, drives, speakers, monitors, and much more for repurposing and recycling."
                                }, 
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.415779, 33.972561]
                                }
                            }, { // marker 6
                                type: 'Feature',
                                properties: {
                                    description: "<strong>ecoATM</strong><br>\
                                    191 Alps Rd, Athens, GA 30606 (inside Kroger)<br><br>\
                                    ecoATM accepts phones and tablets for reuse and even gives money in\
                                    exchange for unwanted items!"
                                },
                                geometry: { // geometry of this point
                                    type: "Point",
                                    coordinates: [-83.406769, 33.946789]
                                }
                            }
                        ] // features (array for 1+)
                    } // data
                }, // source information

                layout: {
                    "icon-image": "custom-marker"
                } // layout information
            }); // map.addLayer
        }); // map.loadImage
    }); // map.on (load)

    // for when popups are clicked (all three of the following are for popups)
    map.on('click', 'markers', function(e) {
        // get coordinates and description from pin after click
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // create a new popup, set its location to event location, set its description, and add it to map
        new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
    }); // map.on (click) for infowindow popup

    map.on('mouseenter', 'markers', function(e) {
        map.getCanvas().style.cursor = 'pointer';
    }); // map.on (mouseenter) to change mouse to pointer

    map.on('mouseleave', 'markers', function(e) {
        map.getCanvas().style.cursor = '';
    }); // map.on (mouseenter) to change mouse back to normal
} // createMap