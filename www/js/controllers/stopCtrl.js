(function() {

    var app = angular.module('Bus-app');

    app.controller('stopCtrl', function ($scope, $rootScope, Journeys) {

        var openMenu = 0;
        var journeys = null;

        $scope.isOpen = function(number) {

            if (number == openMenu) {
                return true;
            }

            return false;
        };

        $scope.openMenu = function(number) {

            openMenu = number;
        };

        $scope.name = $rootScope.stop.name + " (" + $rootScope.stop.shortName + ")";

        Journeys.getJourney("http://data.itsfactory.fi/journeys/api/1/journeys?routeId=" + $rootScope.route.url.split("/").slice(-1)[0]).then(function (data) {
            journeys = data.body;
            setValues();
        }, function() {
            console.log("Can't get journey");
        });

        var setValues = function() {

            $scope.$apply(function() {

                var journeys1 = [];
                var journeys2 = [];
                var journeys3 = [];


                for (var index = 0; index < journeys.length; index++) {

                    var one = false;
                    var two = false;
                    var three = false;

                    var jCall = null;

                    for (var index1 = 0; index1 < journeys[index].calls.length; index1++) {
                        var call = journeys[index].calls[index1];
                        if (call.stopPoint.shortName == $scope.stop.shortName) {
                            jCall = call;
                            break;
                        }
                    }
                    if (jCall == null)
                        continue;

                    for (var index2 = 0; index2 < journeys[index].dayTypes.length; index2++) {

                        if (!two && journeys[index].dayTypes[index2] == "saturday") {
                            two = true;
                            journeys2.push(jCall);
                        } else if (!three && journeys[index].dayTypes[index2] == "sunday"){
                            three = true;
                            journeys3.push(jCall);
                        } else if (!one && journeys[index].dayTypes[index2] != "sunday"
                            && journeys[index].dayTypes[index2] != "sunday"){

                            if (journeys[index].dayTypes.length >= 3) {
                                one = true;
                                journeys1.push(jCall);

                        }
                    }
                }

                var times1 = [];
                var times2 = [];
                var times3 = [];

                for (var index3 = 0; index3 < journeys1.length; index3++) {

                    times1.push(journeys1[index3].departureTime.split(":"));
                }
                for (var index3 = 0; index3 < journeys2.length; index3++) {

                    times2.push(journeys2[index3].departureTime.split(":"));
                }
                for (var index3 = 0; index3 < journeys3.length; index3++) {

                    times3.push(journeys3[index3].departureTime.split(":"));
                }
                console.log(times1);


                var hours = [];
                var hours2 = [];
                var hours3 = [];

                for (var index3 = 0; index3 < times1.length; index3++) {

                    var hour = times1[index3][0];
                    var min = times1[index3][1];
                    var found = false;

                    for (var index4 = 0; index4 < hours.length; index4++) {

                        if (hours[index4][0] == hour) {
                            if (hours[index4][1].indexOf(min) == -1) {
                                hours[index4][1].push(min);
                            }
                            found = true;
                        }
                    }

                    if (!found) {
                        hours.push([hour, [min]]);
                    }
                }
                for (var index3 = 0; index3 < times2.length; index3++) {

                    var hour = times2[index3][0];
                    var min = times2[index3][1];
                    var found = false;

                    for (var index4 = 0; index4 < hours2.length; index4++) {

                        if (hours2[index4][0] == hour) {
                            if (hours2[index4][1].indexOf(min) == -1) {
                                hours2[index4][1].push(min);
                            }
                            found = true;
                        }
                    }

                    if (!found) {
                        hours2.push([hour, [min]]);
                    }
                }
                for (var index3 = 0; index3 < times3.length; index3++) {

                    var hour = times3[index3][0];
                    var min = times3[index3][1];
                    var found = false;

                    for (var index4 = 0; index4 < hours3.length; index4++) {

                        if (hours3[index4][0] == hour) {

                            if (hours3[index4][1].indexOf(min) == -1) {
                                hours3[index4][1].push(min);
                            }
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        hours3.push([hour, [min]]);
                    }
                }

                $scope.hours1 = hours;
                $scope.hours2 = hours2;
                $scope.hours3 = hours3;
            }});
        }
    });
})();