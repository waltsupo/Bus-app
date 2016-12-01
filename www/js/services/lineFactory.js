(function () {

    var app = angular.module('Bus-app');

    app.factory('Lines', ["$resource", function ($resource, Utils) {

        // Default path to get information about lines
        var path = "http://data.itsfactory.fi/journeys/api/1/lines";

        var lines = {};

        lines.getLines = function () {

            return Utils.getResponse(path);
        };

        return lines;
    }]);

})();