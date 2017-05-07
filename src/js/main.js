var map;

var washingtonDcLatLng = {lat: 38.8976755, lng: -77.0451128};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: washingtonDcLatLng,
        zoom: 14
    });

    /*
     * Code taken from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */

    var input = document.getElementById('pac-input')
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        viewModel.setListItems(places);
    });
}

var ViewModel = function() {
    var self = this;
    self.listItems = ko.observableArray([]);

    self.setListItems = function(newListItems) { // todo - should this be ko.computed()?
        // todo - handle the case where newListItems is empty
        self.listItems.removeAll();
        for (var i = 0; i < newListItems.length; ++i) {
            // todo - restrict this to just restaurants
            self.listItems.push(newListItems[i]);
        }
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);