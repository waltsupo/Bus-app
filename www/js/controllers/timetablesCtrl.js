(function() {

    var app = angular.module('Bus-app');

    app.controller('timetablesCtrl', function ($rootScope, $scope, $ionicPopover, $ionicSideMenuDelegate,
                                               Lines, Routes, Patterns, Map) {

        $scope.stops = {stopPoints: []};
        $scope.line = null;
        $scope.lines = [];
        $scope.description = null;
        $rootScope.hideLeft = true;
        $scope.dir = 1;

        var selected_stop = 0;
        var map_open = false;
        var pattern = null;

        // Set up lines Popover and save it to variable
        $ionicPopover.fromTemplateUrl('templates/route-list.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        // Lines Popover
        $scope.open_lines = function ($event) {

            $rootScope.map.setClickable(false);
            $scope.popover.show($event);
        };

        $scope.close_lines = function () {

            $scope.popover.hide();
        };

        $scope.open_stop = function(stopPoint) {

            $rootScope.stop = stopPoint;
            location.href = "#/app/stop";
        };

        $scope.change_dir = function () {

            if ($scope.dir == 1) {
                $scope.dir = 0;
            } else {
                $scope.dir = 1;
            }

            loadLine();
        };

        // Lines list items
        $scope.selectLine = function (line) {

            $scope.close_lines();
            $scope.line = line;
            loadLine();
        };

        var loadLine = function () {

            $scope.map.clear();

            Routes.getRoute($scope.line.name, []).then(function (routes) {

                // Get route with most journeys to display on the map
                var route = null;
                var maxL = 0;

                for (var index = 0; index < routes.body.length; index++) {

                    if (routes.body[index].journeys.length
                        > maxL && routes.body[index].journeys[0].directionId == $scope.dir) {

                        route = routes.body[index];
                        maxL = route.journeys.length;
                    }
                }

                $scope.$apply(function() {$scope.route = route;$rootScope.route = route});

                // Get stop points and draw those and the line to the map
                Patterns.getPattern(route.journeyPatterns[0].url).then(
                    function(newPattern) {
                        pattern = newPattern;
                        drawMap();
                    }, function() {
                        console.log("Can't get pattern");
                    });
            }, function() {
                console.log("Can't load route");
            });
        };

        $scope.openMap = function() {

            if (map_open) {
                map_open = false;
                document.getElementById("map_canvas").style.height="30%";
                document.getElementById("stops").style.top="37%";
            } else {
                map_open = true;
                document.getElementById("map_canvas").style.height="100%";
                document.getElementById("stops").style.top="100%";
            }
        };

        var drawMap = function() {

            // Line
            // Change string of coordinates to array of coordinates
            var lineCoords = [];
            var projectionSTR =
                $scope.route.geographicCoordinateProjection.split(":");
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
            $scope.$apply(function () {
                $scope.stops.stopPoints = pattern.body[0].stopPoints;
            });

            for (var stopI = 0; stopI < $scope.stops.stopPoints.length; stopI++) {

                var position = $scope.stops.stopPoints[stopI].location.split(",");
                if (stopI == selected_stop) {
                    Map.drawSelectedStop(new plugin.google.maps.LatLng(
                        position[0], position[1]));
                } else {
                    Map.drawStop(new plugin.google.maps.LatLng(
                        position[0], position[1]));
                }
            }
        };

        var loadMap = function() {

            var div = document.getElementById("map_canvas");

            if ($rootScope.map) {
                $rootScope.map.setDiv(div);
            } else {
                $rootScope.map = window.plugin.google.maps.Map.getMap(div);
            }

            $rootScope.map.animateCamera({
                target: {lat: 61.498753, lng: 23.776895},
                zoom: 12,
                duration: 500
            });
        };

        // When device is ready, set up the map
        document.addEventListener("deviceready", function () {

            loadMap();

            $scope.$on('popover.hidden', function () {
                $rootScope.map.setClickable(true);
            });
            $scope.$on("$ionicView.enter", function(event, data) {
                $rootScope.map.setDiv(document.getElementById("map_canvas"));
            });

            Lines.getLines().then(function(data) {
                var notactive = ["2S", "13", "4YY", "13R", "13L", "14U", "24", "28",
                    "35R", "36T", "36", "40T", "40K", "45P", "45SP",
                    "45SS", "47", "47L", "47H", "50K", "51", "52",
                    "52I", "53T", "53", "54", "65z", "71T", "71M",
                    "71SKa", "71Ka", "95", "95X", "95R", "100"];
                $scope.lines = data.body;

                for (var index = $scope.lines.length - 1; index >= 0; index--) {
                    for (var index2 = 0; index2 < notactive.length; index2++) {
                        if ($scope.lines[index].name == notactive[index2]) {
                            $scope.lines.splice(index, 1);
                            break;
                        }
                    }
                }
                $scope.selectLine($scope.lines[0]);

            }, function () {
                console.log("Can't get lines");
            });

        }, false);
    })
})();