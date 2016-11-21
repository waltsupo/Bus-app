(function () {

    var app = angular.module('Bus-app');

    app.factory('Routes', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var routes = {};

        routes.getRoute = function (lineId) {

            return new Promise(function(resolve, reject) {

                var resource = $resource(path + "?lineId=" + lineId);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };

        return routes;
    }]);

})();
