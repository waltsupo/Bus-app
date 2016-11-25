(function() {

    var app = angular.module('Bus-app');

    app.controller('timetablesCtrl', function ($scope, $rootScope, Routes, Patterns, Map) {

        $scope.change_dir = function() {
            $scope.change_dir = function () {

                if ($rootScope.dir == 1) {
                    $rootScope.dir = 0;
                } else {
                    $rootScope.dir = 1;
                }

                loadLine();
            };
        };

        var loadLine = function () {

            $rootScope.map.clear();

            Routes.getRoute($scope.line.name, []).then(function (routes) {

                // Get route with most journeys to display on the map
                var route = null;
                var maxL = 0;

                for (var index = 0; index < routes.body.length; index++) {

                    if (routes.body[index].journeys.length
                        > maxL && routes.body[index].journeys[0].directionId == $rootScope.dir) {

                        route = routes.body[index];
                        maxL = route.journeys.length;
                    }
                }

                $rootScope.route = route;

                // Get stop points and draw those and the line to the map
                Patterns.getPattern(route.journeyPatterns[0].url).then(
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
                        Map.drawLine(lineCoords);

                        // Stops
                        var stops = pattern.body[0].stopPoints;

                        for (var stopI = 0; stopI < stops.length; stopI++) {

                            var position = stops[stopI].location.split(",");
                            Map.drawStop(new plugin.google.maps.LatLng(
                                position[0], position[1]));
                        }
                    }, function() {
                        console.log("Can't get pattern");
                    });
            }, function() {
                console.log("Can't load route");
            });
        };
    })
})();