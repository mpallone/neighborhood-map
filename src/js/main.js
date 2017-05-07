var map;

var washingtonDcLatLng = {lat: 38.8934237, lng: -77.0588182};

var sideMenuIsHidden = false;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: washingtonDcLatLng,
        zoom: 14
    });

    /*
    var locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}}
    ];

    var tribeca = {lat: 40.719526, lng: -74.0089934};
    var marker = new google.maps.Marker({
     position: tribeca,
     map: map,
     title: 'First Marker!'
    });
    var infowindow = new google.maps.InfoWindow({
     content: 'info window content'
    });
    marker.addListener('click', function() {
     infowindow.open(map, marker);
    });
    */

}

// todo remove
for (var i = 0; i < 200; ++i) {
    $('#test-list').append('<li>Element ' + i + '</li>')
}

