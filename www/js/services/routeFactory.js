(function () {

    var app = angular.module('Bus-app');

    app.factory('Routes', ["$resource", function (Utils) {

        // Default path to get route info
        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var routes = {};

        // Returns json object of line that has given ID
        routes.getRoute = function (lineId) {

            var url = path + "?lineId=" + lineId;

            return Utils.getResponse(url);
        };

        return routes;
    }]);

})();
