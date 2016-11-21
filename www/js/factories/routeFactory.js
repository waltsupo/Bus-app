(function () {

    var app = angular.module('Bus-app');

    app.factory('Routes', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var routes = {};

        routes.getRoutes = function (lineId, callback) {

            var resource = $resource(path + "?lineId=" + lineId);

            resource.get({}, function (res) {
                callback(res);
            }, function () {
                callback(null);
            });
        };

        return routes;
    }]);

})();
