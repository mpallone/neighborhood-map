var map;
var placesService;
var searchBox;
var inputBox = document.getElementById('pac-input');
var nycLatLng = { lat: 40.7481831, lng: -74.0070031 };

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: nycLatLng,
        zoom: 13
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
        if (newText.trim() === "") {
            // If the user emptied the search box, display all items
            self.setListItems(self.unfilteredPlaceList);
        } else {
            // Otherwise, filter based on the user's search
            var filteredItems = self.filterList(newText);
            self.setListItems(filteredItems);
        }
    });

    /*
     * This is called to reset the displayed list items on the page.
     *
     * newListItems should be an array of Google Maps Places.
     */
    self.setListItems = function(newListItems) {

        self.listItems.removeAll();

        // delete old markers
        for (var i = 0; i < self.markers.length; ++i) {
            self.markers[i].setMap(null);
        }
        self.markers = [];

        var handleMarkerClick = function() {
            self.handleListElementOrMarkerClick(this);
        };
        // Add new list entries and markers
        for (i = 0; i < newListItems.length; ++i) {
            // verify that we're dealing with food/drink establishments
            if ($.inArray('restaurant', newListItems[i].types) == -1 &&
                $.inArray('cafe', newListItems[i].types) == -1       &&
                $.inArray('bar', newListItems[i].types) == -1        &&
                $.inArray('bakery', newListItems[i].types) == -1)
            {
                continue;
            }

            self.listItems.push(newListItems[i]);

            // Add a clickable marker for the new location
            var marker = new google.maps.Marker({
                position: newListItems[i].geometry.location,
                map: map,
                title: newListItems[i].geometry.name,
                // animation: google.maps.Animation.DROP, // obnoxious
                placeData: newListItems[i],
                iAmAMarker: true
            });
            marker.addListener('click', handleMarkerClick);
            self.markers.push(marker);
        }
    };

    /*
     * returns a new list, with elements filtered based on the text
     */
    self.filterList = function(filterText) {
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
    };

    self.initializeListItems = function () {
        // Set the first list that the user sees to my favorite locations
        // cookbooked off of http://stackoverflow.com/a/36191621/5373846
        var request = {
            query: 'coffee in Manhatten, NYC',
            bounds: map.getBounds()
        };
        placesService.textSearch(request, function(places) {
            self.unfilteredPlaceList = places;
            self.setListItems(places);
        });
    };

    self.handleListElementOrMarkerClick = function(data) {
        var placeData;
        var marker;

        // Determine if the user clicked on the list, or on a marker
        if (data.iAmAMarker) {
            // user clicked on a marker
            placeData = data.placeData;
            marker = data;
        } else {
            placeData = data;
            // User clicked on the list. Find the corresponding marker.
            for (var i = 0; i < self.markers.length; ++i) {
                if (placeData.id == self.markers[i].placeData.id) {
                    marker = self.markers[i];
                    break;
                }
            }
        }

        if (self.currentInfoWindow === null) {
            self.currentInfoWindow = new google.maps.InfoWindow();
        }

        // create InfoWindow and add it to marker
        if (self.currentInfoWindow === null || self.currentInfoWindow.marker != marker) {
            if (self.currentInfoWindow !== null) {
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

            // Add any NYT articles about the coffee shop/chain (Built by LucyBot. www.lucybot.com)
            var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
            url += '?' + $.param({
              'api-key': "7112833395c14519bee52c0a452a553d",
              'q': placeData.name
            });
            var headerHtml = '<h5>New York Times Related Article</h5>';
            $.ajax({
                url: url,
                method: 'GET',
            }).done(function(result) {
                docs = result.response.docs;
                if (docs.length > 0) {
                    if (docs[0].snippet !== null && docs[0].web_url !== null) {
                        var htmlArticleString = headerHtml;
                        htmlArticleString += '<a href="' + docs[0].web_url + '">' + docs[0].headline.main + '</a>';
                        htmlArticleString += '<p>' + docs[0].snippet + '</p>';
                        self.currentInfoWindow.setContent(self.currentInfoWindow.content + htmlArticleString);
                    }
                } else {
                    self.currentInfoWindow.setContent(
                        self.currentInfoWindow.content + headerHtml + '<p>No NYTimes articles found.</p>');
                }
            }).fail(function(err) {
                self.currentInfoWindow.setContent(
                    self.currentInfoWindow.content + headerHtml + '<p>Could not reach NYTimes server.</p>');
            });
        }

        marker.setAnimation(google.maps.Animation.DROP);
    };
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

