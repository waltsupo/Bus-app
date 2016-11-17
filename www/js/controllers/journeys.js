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

      Routes.getRoutes($scope.line, function(data) {

        console.log("loadLine: " + data);
        JourneyPatterns.getPattern(data.body[0].journeyPatterns[0].url, function(patt) {

          var stops = patt.body[0].stopPoints;

          var positions = [];

          for (var stopI = 0; stopI < stops.length; stopI++) {

            var position = stops[stopI].location.split(",");
            positions.push(new plugin.google.maps.LatLng(position[0], position[1]));
          }

          $scope.map.addPolyline({
            points: positions,
            'color' : '#AA00FF',
            'width': 10,
            'geodesic': true
          });

          for (var stopI = 0; stopI < positions.length; stopI++) {

            $scope.map.addCircle({
              'center': positions[stopI],
              'radius': 50,
              'strokeColor' : '#8fbc8f',
              'strokeWidth': 5,
              'fillColor' : '#8fbc8f'
            });
          }
           /* if (stopI == 0)
              flatlng = latlng;

            $scope.map.addCircle({
              'center': latlng,
              'radius': 30,
              'strokeColor' : '#8fbc8f',
              'strokeWidth': 5,
              'fillColor' : '#8fbc8f'
            });

            if (stopI == stops.length - 1) {

              $scope.map.addPolyline({
                points: [
                  flatlng,
                  latlng
                ],
                'color' : '#AA00FF',
                'width': 10,
                'geodesic': true
              });
            }
          }*/
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
