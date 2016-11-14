(function () {

  var app = angular.module('Bus-app');

  app.controller("journeys", function ($rootScope, $scope, Journeys) {

    var loadMap = function(map) {

      Journeys.getJourneys(function(data) {
        var stops = data.body[0].stopPoints;

        for (var stopI = 0; stopI < stops.length; stopI++) {

          var position = stops[stopI].location.split(",");

          map.addMarker({
            position: {lat: position[0], lng: position[1]},
            title: "test marker"
          }, function(marker) {

            // Show the info window
            marker.showInfoWindow();

            // Catch the click event
            marker.on(window.plugin.google.maps.event.INFO_CLICK, function() {

              // To do something...
              alert("Hello world!");

            });
          });
          console.log("marker set");
        }
      });
    };

    document.addEventListener("deviceready", function($scope) {

      var div = document.getElementById("map_canvas");

      // Initialize the map view
      var map = window.plugin.google.maps.Map.getMap(div);
      loadMap(map);
    }, false);

  });

})();
