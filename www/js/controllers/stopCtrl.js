(function() {

    var app = angular.module('Bus-app');

    app.controller('stopCtrl', function ($scope, $rootScope, Utils) {

        var openMenu = 0;
        var journeys = null;

        $scope.name = $rootScope.stop.name + " (" + $rootScope.stop.shortName + ")";

        Utils.getResponse(
            "http://data.itsfactory.fi/journeys/api/1/journeys?routeId="
            + $rootScope.route.url.split("/").slice(-1)[0])
            .then(function (data) {

                journeys = data.body;
                setValues();
        }, function() {
            console.log("Can't get journey");
        });

        // Methods to handle content
        $scope.isOpen = function(number) {

            return number == openMenu
        };

        $scope.openMenu = function(number) {

            openMenu = number;
        };

        var sortJourneys = function() {

            var sortedJourneys = {monfri : [], sat : [], sun : []};

            for (var journeyI = 0; journeyI < journeys.length; journeyI++) {

                // Find right stop with estimated time
                var jCall = null;

                for (var callI = 0;
                     callI < journeys[journeyI].calls.length; callI++) {

                    var call = journeys[journeyI].calls[callI];
                    if (call.stopPoint.shortName == $scope.stop.shortName) {
                        jCall = call;
                        break;
                    }
                }

                if (jCall == null)
                    continue;

                // Is jCall added to array
                var monfri = false;
                var sat = false;
                var sun = false;

                // Add journey's estimated time to correct array
                for (var dayI = 0;
                     dayI < journeys[journeyI].dayTypes.length; dayI++) {

                    if (!sat
                        && journeys[journeyI].dayTypes[dayI] == "saturday") {

                        sat = true;
                        sortedJourneys.sat.push(jCall);
                    } else if (!sun
                        && journeys[journeyI].dayTypes[dayI] == "sunday") {

                        sun = true;
                        sortedJourneys.sun.push(jCall);
                    } else if (!monfri
                        && journeys[journeyI].dayTypes[dayI] != "sunday"
                        && journeys[journeyI].dayTypes[dayI] != "saturday") {

                        // If journey is run over half from the week, add it
                        if (journeys[journeyI].dayTypes.length >= 3) {
                            monfri = true;
                            sortedJourneys.monfri.push(jCall);
                        }
                    }
                }
            }

            return sortedJourneys;

        };

        var getTimes = function() {

            var sortedJourneys = sortJourneys();
            var timesStr = {monfri : [], sat : [], sun : []};

            for (var strKey in timesStr) {
                for (var dayI = 0; dayI < sortedJourneys[strKey].length; dayI++) {

                    timesStr[strKey].push(
                        sortedJourneys[strKey][dayI].departureTime.split(":"));
                }
            }

            var times = {monfri : [], sat : [], sun : []};
            var hour;
            var min;
            var found;

            for (var key in timesStr) {

                for (var timeI = 0; timeI < timesStr[key].length; timeI++) {

                    hour = timesStr[key][timeI][0];
                    min = timesStr[key][timeI][1];
                    found = false;

                    for (var hourI = 0; hourI < times[key].length; hourI++) {

                        if (times[key][hourI][0] == hour) {
                            if (times[key][hourI][1].indexOf(min) == -1) {
                                times[key][hourI][1].push(min);
                            }
                            found = true;
                        }
                    }

                    if (!found) {
                        times[key].push([hour, [min]]);
                    }
                }

            }

            return times;
        };

        var setValues = function() {

            $scope.$apply(function() {

                $scope.times = getTimes();
            });
        };
    });
})();