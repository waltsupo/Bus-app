(function () {

    var app = angular.module('Bus-app');

    app.factory('Journeys', function (Utils) {

        var path = "http://data.itsfactory.fi/journeys/api/1/journey-patterns";

        var journeys = {};

        journeys.getJourneys = function () {

            return Utils.getResponse(path);
        };

        return journeys;
    });

})();
