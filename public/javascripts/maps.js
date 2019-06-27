//initializes the map and calls for recycling plants in athens
function initMap() {
    //creates map and sets center, zoom
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.944895,lng: -83.376212}, 
        zoom: 13});

    //initializes infowindow
    infoWindow = new google.maps.InfoWindow();

    // request variable for searching for recycling plants
    var request = {
        query: 'recycling center',
        fields: ['name', 'geometry'],
        location: {lat: 33.944895,lng: -83.376212},
        radius: 1000
        //locationbias: {point: {lat: 33.944895,lng: -83.376212}}
    };

    //service to make request
    var service = new google.maps.places.PlacesService(map);

    //search for recycling plants, if successful, create markers
    //for each result
    service.textSearch(request, function(results, status) {
        if(status === google.maps.places.PlacesServiceStatus.OK) {
            for(var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            } // for each location

        } // if status is ok
    });
} // initMap

//creates a marker given a location
function createMarker(place) {

    // make marker object
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    // shows infoWindow on hover
    google.maps.event.addListener(marker, 'mouseover', function(){
        // takes 'USA' off of addresses
        var shortenedAddress = place.formatted_address.substring(0, place.formatted_address.length - 5);
        
        // handles case where instead of USA, address said 'United States'
        if(place.name === "CMC Recycling") 
            shortenedAddress = shortenedAddress.substring(0, shortenedAddress.length - 10);
        
        //sets the infoWindow text to match the marker and places marker on map
        infoWindow.setContent("<b>" + place.name + "</b><br>" + shortenedAddress);
        infoWindow.open(map, this);
    });

    // hides infoWindow on mouse leave
    google.maps.event.addListener(marker, 'mouseout', function(){
        infoWindow.close();
    });
} // createMarker