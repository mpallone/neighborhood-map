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

    placesService = new google.maps.places.PlacesService(map);
    viewModel.initializeListItems();
}

var ViewModel = function() {
    var self = this;
    self.listItems = ko.observableArray([]);
    self.markers = [];
    self.unfilteredPlaceList = [];

    self.setListItems = function(newListItems) { // todo - should this be ko.computed()?
        // todo - handle the case where newListItems is empty
        self.listItems.removeAll();

        // delete old markers
        for (var i = 0; i < self.markers.length; ++i) {
            self.markers[i].setMap(null);
        }
        self.markers = [];

        // Add new list entries and markers
        for (var i = 0; i < newListItems.length; ++i) {
            // verify that we're dealing with food/drink establishments
            if ($.inArray('restaurant', newListItems[i].types) == -1 &&
                $.inArray('cafe', newListItems[i].types) == -1       &&
                $.inArray('bar', newListItems[i].types) == -1        &&
                $.inArray('bakery', newListItems[i].types) == -1)
            {
                continue;
            }

            self.listItems.push(newListItems[i]);

            var marker = new google.maps.Marker({
                position: newListItems[i].geometry.location,
                map: map,
                title: newListItems[i].geometry.name,
            });
            marker.addListener('click', self.handleListElementOrMarkerClick)
            self.markers.push(marker);
        }
    }

    self.initializeListItems = function () {
        // Set the first list that the user sees to my favorite locations
        // cookbooked off of http://stackoverflow.com/a/36191621/5373846
        var request = {
            query: 'coffee in DC',
            bounds: map.getBounds()
        };
        placesService.textSearch(request, function(places) {
            self.unfilteredPlaceList = places;
            self.setListItems(places);
        });
    }

    self.handleListElementOrMarkerClick = function(data) {
        console.log("A list element or marker was clicked! data: ", data);
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

