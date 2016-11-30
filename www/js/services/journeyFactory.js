(function () {

    var app = angular.module('Bus-app');

    app.factory('Journeys', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/journey-patterns";

        var journeys = {};

        journeys.getJourneys = function () {

            return new Promise(function(resolve, reject) {

                var resource = $resource(path);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };

        journeys.getJourney = function(url) {

            return new Promise(function(resolve, reject) {

                var resource = $resource(url);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };

        return journeys;
    }]);

})();
