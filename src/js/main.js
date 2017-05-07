var map;

var washingtonDcLatLng = {lat: 38.8934237, lng: -77.0588182};

var sideMenuIsHidden = false;

function initMap() {

    console.log("initMap was called");

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



// function toggleSideMenu()
// {
//     // todo - should I be using Knockout for this?

//     console.log("-----------------------");

//     if (! sideMenuIsHidden)
//     {

//     }
//     else
//     {

//     }

//     sideMenuIsHidden = !sideMenuIsHidden;

//     if (sideMenuIsHidden) {
//         console.log("Side menu should now be hidden");
//     } else {
//         console.log("Side menu should now be visible");
//     }


// }

// // todo - should I be using knockout for this?
// $('#hamburger').click(toggleSideMenu);

var slideout = new Slideout({
  'panel': document.getElementById('map-container'),
  'menu': document.getElementById('menu'),
  'padding': 256,
  'tolerance': 70
});

// Toggle button
document.querySelector('.toggle-button').addEventListener('click', function() {
  slideout.toggle();
});

