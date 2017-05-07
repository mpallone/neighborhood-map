var map;
var placesService;
var searchBox;
var inputBox = document.getElementById('pac-input');
var washingtonDcLatLng = {lat: 38.8976755, lng: -77.0451128};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: washingtonDcLatLng,
        zoom: 14
    });

    /*
     * Code taken from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */

    searchBox = new google.maps.places.SearchBox(inputBox);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); // too hard to see

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        viewModel.setListItems(places);
    });

    placesService = new google.maps.places.PlacesService(map);
    viewModel.initializeListItems();
}

var ViewModel = function() {
    var self = this;
    self.listItems = ko.observableArray([]);
    self.markers = [];

    self.setListItems = function(newListItems) { // todo - should this be ko.computed()?
        // todo - handle the case where newListItems is empty
        self.listItems.removeAll();
        // delete old markers
        for (var i = 0; i < self.markers.length; ++i) {
            self.markers[i].setMap(null);
        }
        self.markers = [];
        for (var i = 0; i < newListItems.length; ++i) {
            // todo - restrict this to just restaurants
            self.listItems.push(newListItems[i]);
            self.markers.push(new google.maps.Marker({
                position: newListItems[i].geometry.location,
                map: map,
                title: newListItems[i].geometry.name
            }));
        }
    }

    self.initializeListItems = function () {
        // Set the first list that the user sees to my favorite locations
        // cookbooked off of http://stackoverflow.com/a/36191621/5373846
        var request = {
            query: inputBox.placeholder,
            bounds: searchBox.getBounds()
        };
        placesService.textSearch(request, function(places) {
            searchBox.set('places', places || [])
        });
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

