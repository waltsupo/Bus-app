(function () {

    var app = angular.module('Bus-app');

    app.controller("journeys", function ($rootScope, $scope, $ionicPopover,
                                         Lines, Routes, Patterns, Map) {

        $scope.line = null;
        $scope.lines = [];

        Lines.getLines(function (data) {

            var unactive = ["2S", "13", "4YY", "13R", "13L", "24", "28",
                "35R", "36T", "36", "40T", "40K", "45P", "45SP",
                "45SS", "47", "47L", "47H", "50K", "51", "52",
                "52I", "53T", "53", "54", "65z", "71T", "71M",
                "71SKa", "71Ka", "95", "95X", "95R", "100"];
            $scope.lines = data.body;

            for (var index = $scope.lines.length - 1; index >= 0; index--) {
                for (var index2 = 0; index2 < unactive.length; index2++) {
                    if ($scope.lines[index].name == unactive[index2]) {
                        $scope.lines.splice(index, 1);
                        break;
                    }
                }
            }
        });

        // Set up lines Popover and save it to variable
        $ionicPopover.fromTemplateUrl('templates/route-list.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        // Lines Popover
        $scope.open_lines = function ($event) {

            $scope.map.setClickable(false);
            $scope.popover.show($event);
        };

        $scope.close_lines = function () {

            $scope.popover.hide();
        };

        // Lines list items
        $scope.selectLine = function (line) {

            $scope.close_lines();
            $scope.line = line;
            loadLine();
        };

        var loadLine = function () {

            $scope.map.clear();

            Routes.getRoutes($scope.line.name, function (routes) {

                // Get route with most journeys to display on the map
                var route = routes.body[0];

                for (var index = 1; index < routes.body.length; index++) {

                    if (routes.body[index].journeys.length
                        > route.journeys.length) {

                        route = routes.body[index];
                    }
                }

                // Get stop points and draw those and the line to the map
                Patterns.getPattern(route.journeyPatterns[0].url,
                    function (pattern) {

                        // Line
                        // Change string of coordinates to array of coordinates
                        var lineCoords = [];
                        var projectionSTR =
                            route.geographicCoordinateProjection.split(":");
                        var projection = [];

                        for (var projInd = 0;
                             projInd < projectionSTR.length; projInd++) {
                            projection.push(projectionSTR[projInd]
                                .split(",").map(Number));
                        }

                        // Create LatLngs from array values
                        var lat = projection[0][0] / 100000;
                        var lng = projection[0][1] / 100000;
                        lineCoords.push(
                            new plugin.google.maps.LatLng(lat, lng));

                        for (var index = 1;
                             index < projection.length; index++) {

                            lat -= projection[index][0] / 100000;
                            lng -= projection[index][1] / 100000;
                            lineCoords.push(
                                new plugin.google.maps.LatLng(lat, lng));
                        }

                        // Draw line
                        Map.drawLine($scope.map, lineCoords);

                        // Stops
                        var stops = pattern.body[0].stopPoints;

                        for (var stopI = 0; stopI < stops.length; stopI++) {

                            var position = stops[stopI].location.split(",");
                            Map.drawStop($scope.map,
                                new plugin.google.maps.LatLng(
                                position[0], position[1]));
                        }
                    });
            });
        };

        var loadMap = function (map) {

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


            $scope.$on('popover.hidden', function () {
                $scope.map.setClickable(true);
            });
        };

        // When device is ready, set up the map
        document.addEventListener("deviceready", function ($scope) {

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
