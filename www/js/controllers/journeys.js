(function () {

  var app = angular.module('Bus-app');

  app.controller("journeys", function ($rootScope, $scope, $ionicPopover, Routes, JourneyPatterns) {

    $scope.line = "";

    // Set up lines Popover and save it to variable
    $ionicPopover.fromTemplateUrl('templates/route-list.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    // Lines Popover
    $scope.open_lines = function($event) {

      $scope.map.setClickable(false);
      $scope.popover.show($event);
    };

    $scope.close_lines = function() {

      $scope.popover.hide();
    };

    // Lines list items
    $scope.selectLine = function(line) {

      $scope.close_lines();
      $scope.line = line;
      loadLine();
    };

    var loadLine = function() {

      $scope.map.clear();

      Routes.getRoutes($scope.line, function(routes) {

        // Get route with most journeys to display on the map
        var route = routes.body[0];

        for (var index = 1; index < routes.body.length; index++) {

          if (routes.body[index].journeys.length > route.journeys.length) {

            route = routes.body[index];
          }
        }

        // Get stop points and draw those and the line to the map
        JourneyPatterns.getPattern(route.journeyPatterns[0].url, function(pattern) {

          // Line
          var lineCoords = [];

          var projectionSTR = route.geographicCoordinateProjection.split(":");
          var projection = [];

          for (var projInd = 0; projInd < projectionSTR.length; projInd++) {
            projection.push(projectionSTR[projInd].split(",").map(Number));
          }

          var lat = projection[0][0] / 100000;
          var lng = projection[0][1] / 100000;
          lineCoords.push(new plugin.google.maps.LatLng(lat, lng));

          for (var index = 1; index < projection.length; index++) {
            console.log("hello");
            lat -= projection[index][0] / 100000;
            lng -= projection[index][1] / 100000;
            lineCoords.push(new plugin.google.maps.LatLng(lat, lng));
          }

          console.log(lineCoords);
          // Draw line
          $scope.map.addPolyline({
            points: lineCoords,
            'color' : '#add8e6',
            'width': 10,
            'geodesic': true
          });

          // Stops
          var stops = pattern.body[0].stopPoints;

          for (var stopI = 0; stopI < stops.length; stopI++) {

            var position = stops[stopI].location.split(",");
            $scope.map.addCircle({
              'center': new plugin.google.maps.LatLng(position[0], position[1]),
              'radius': 50,
              'strokeColor' : '#008000',
              'strokeWidth': 0,
              'fillColor' : '#008000',
              'zIndex' : '5'
            });
          }
        });
      });
    };

    var loadMap = function(map) {

      /*Journeys.getJourneys(function(data) {
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
      });*/

      $scope.map = map;


      $scope.$on('popover.hidden', function() {
        $scope.map.setClickable(true);
      });
    };

    // When device is ready, set up the map
    document.addEventListener("deviceready", function($scope) {

      // Get map element
      var div = document.getElementById("map_canvas");

      // Initialize the map view
      var map = window.plugin.google.maps.Map.getMap(div);

      // Move camera to show Tampere
      map.animateCamera({
        target: {lat: 61.498753, lng: 23.776895},
        zoom: 12,
        duration: 2000
      });

      loadMap(map);
    }, false);
  });
})();
