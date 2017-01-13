(function() {

    var app = angular.module('Bus-app');

    // Controller for Routes (Reittihaku)-view
    app.controller('routesCtrl', function ($scope, $rootScope, Paths, Map) {

        $scope.mapOpen = false;
        $scope.paths = null;

        var pathsData = null;
        var state = 0;
        var start = null;
        var end = null;

        // Open map full screen
        $scope.openMap = function() {

            if ($scope.mapOpen) {
                $scope.mapOpen = false;
                document.getElementById("map_canvas2").style.height="30%";
                document.getElementById("times").style.top="37%";
            } else {
                $scope.mapOpen = true;
                document.getElementById("map_canvas2").style.height="100%";
                document.getElementById("times").style.top="100%";
            }
        };

        // When view entered
        $scope.$on("$ionicView.enter", function(event, data) {

            $rootScope.map.setDiv(document.getElementById("map_canvas2"));
            $rootScope.map.clear();

            $rootScope.map.onClick = function(latLng) {
                onClick(latLng);
            };

            getPath();
        });

        // Select path
        $scope.selectPath = function(ID) {

            drawPath(pathsData[ID][0]);
        };

        // Get paths between start and end
        var getPath = function() {

            if (!start || !end) {
                return;
            }

            Paths.getPath(
                start.getCenter(), end.getCenter()).then(function(data) {

                $scope.$apply(function() {

                    pathsData = data;
                    var paths = [];

                    for (var pathI = 0; pathI < data.length; pathI ++) {


                        var pathObj = data[pathI][0];
                        var path = {};

                        path.id = pathI;
                        path.start =
                            pathObj.legs[0].locs[0].arrTime.slice(8);
                        path.start =
                            path.start.slice(0,2) + ":" + path.start.slice(2);

                        var lastLocations =
                            pathObj.legs[pathObj.legs.length-1].locs;
                        path.end =
                            lastLocations[lastLocations.length - 1]
                                .arrTime.slice(8);
                        path.end =
                            path.end.slice(0,2) + ":" + path.end.slice(2);

                        path.legs = [];

                        for (var legI = 0; legI < pathObj.legs.length; legI++) {

                            var leg = {};

                            if (pathObj.legs[legI].type == "walk") {
                                leg.description = "Kävelyä "
                                    + pathObj.legs[legI].length + "m";
                            } else {
                                var dep =
                                    pathObj.legs[legI].locs[0].depTime.slice(8);
                                dep = dep.slice(0,2) + ":" + dep.slice(2);
                                var arr =
                                    pathObj.legs[legI].locs[pathObj.legs[legI]
                                        .locs.length-1].arrTime.slice(8);
                                arr = arr.slice(0,2) + ":" + arr.slice(2);
                                leg.description =
                                    "Linja-auto("
                                    + pathObj.legs[legI].code + ") " + dep
                                    + " | " + arr;
                            }

                            path.legs.push(leg);
                        }

                        paths.push(path);
                    }

                    $scope.paths = paths;
                });

                // Draw first path to map
                drawPath(data[0][0]);

            }, function() {
                console.log("error when getting data");
            });
        };

        // Draw given path to map
        var drawPath = function(path) {

            $rootScope.map.clear();

            for (var i = 0; i < path.legs.length; i++) {

                var coords = [];
                var lat = 0;
                var lng = 0;

                for (var a = 0; a < path.legs[i].locs.length; a++) {
                    lat = path.legs[i].locs[a].coord.y;
                    lng = path.legs[i].locs[a].coord.x;
                    coords.push(new plugin.google.maps.LatLng(lat, lng));
                }

                if (path.legs[i].type =="walk") {
                    Map.drawWalkLine(coords);
                } else {
                    Map.drawLine(coords);
                }
            }

            Map.drawStartPoint(start.getCenter());
            Map.drawEndPoint(end.getCenter());
        };

        // Change if touch will set start point or end point
        $scope.changeState = function(newState) {

            state = newState;
        };

        // On touch function
        var onClick = function(latLng) {

            if(state == 0) {

                if(start) {
                    start.setCenter(latLng);
                } else {
                    Map.drawStartPoint(latLng).then(function(circle) {
                        start = circle;

                        if (start && end) {
                            getPath();
                        }
                    });
                }
            } else {

                if(end) {
                    end.setCenter(latLng);
                } else {
                    Map.drawEndPoint(latLng).then(function(circle) {
                        end = circle;

                        if (start && end) {
                            getPath();
                        }
                    });
                }
            }

            if (start && end) {
                getPath();
            }
        };
    })
})();
