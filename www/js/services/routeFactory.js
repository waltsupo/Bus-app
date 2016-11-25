(function () {

    var app = angular.module('Bus-app');

    app.factory('Routes', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var routes = {};

        routes.getRoute = function (lineId, exclusions) {

            var url = path + "?lineId=" + lineId;

            if (exclusions.length > 0) {

                url += "&exclude-fields=";

                for (var index = 0; index < exclusions.length; index++) {

                    url += exclusions[index];

                    if (index < exclusions.length - 1) {
                        url += ",";
                    }
                }
            }

            return new Promise(function(resolve, reject) {

                var resource = $resource(url);

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
