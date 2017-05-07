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
    self.currentInfoWindow = null;

    self.currentFilterText = ko.observable("");
    self.currentFilterText.subscribe(function(newText) {
        if (newText.trim() == "") {
            self.setListItems(self.unfilteredPlaceList);
        } else {
            var filteredItems = self.filterList(newText);
            self.setListItems(filteredItems);
        }
    });

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

            // // todo remove
            // if (i == 0) {
            //     console.log(newListItems[i]);
            // }

            var marker = new google.maps.Marker({
                position: newListItems[i].geometry.location,
                map: map,
                title: newListItems[i].geometry.name,
                // animation: google.maps.Animation.DROP, // obnoxious
                placeData: newListItems[i],
                iAmAMarker: true
            });
            marker.addListener('click', function() {
                self.handleListElementOrMarkerClick(this);
            });
            self.markers.push(marker);
        }
    }

    self.filterList = function(filterText) {
        // returns a new list, with elements filtered based on the text
        var lowercaseFilterText = filterText.toLowerCase();
        var placesToKeep = [];

        // split the filterText, and if any token matches, include it
        var splitStringArray = lowercaseFilterText.split(" ");

        for (var i = 0; i < self.unfilteredPlaceList.length; ++i) {
            var currPlace = self.unfilteredPlaceList[i];
            var lowercaseName = currPlace.name.toLowerCase();

            for (var j = 0; j < splitStringArray.length; ++j) {
                var currToken = splitStringArray[j];
                if (lowercaseName.indexOf(currToken) != -1) {
                    placesToKeep.push(currPlace);
                    break;
                }
            }
        }
        return placesToKeep;
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
        var placeData;
        var marker;
        if (data.iAmAMarker) {
            console.log("user clicked on marker");
            placeData = data.placeData;
            marker = data;
        } else {
            console.log("user clicked on list");
            placeData = data;
            // find the corresponding marker
            for (var i = 0; i < self.markers.length; ++i) {
                if (placeData.id == self.markers[i].placeData.id) {
                    marker = self.markers[i];
                    break;
                }
            }
        }

        if (self.currentInfoWindow == null) {
            self.currentInfoWindow = new google.maps.InfoWindow();
        }

        // create InfoWindow and add it to marker
        if (self.currentInfoWindow == null || self.currentInfoWindow.marker != marker) {
            if (self.currentInfoWindow != null) {
                self.currentInfoWindow.setMarker = null;
            }
            self.currentInfoWindow.marker = marker;
            self.currentInfoWindow.setContent(
                '<div>' + placeData.name + '</div>' +
                '<p>'   + placeData.formatted_address  + '</p>'
                );
            self.currentInfoWindow.open(map, marker);
            self.currentInfoWindow.addListener('closeclick', function() {
                self.currentInfoWindow.setMarker = null;
            });
        }

        marker.setAnimation(google.maps.Animation.DROP);
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

