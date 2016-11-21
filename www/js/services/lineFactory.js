(function () {

    var app = angular.module('Bus-app');

    app.factory('Lines', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/lines";

        var lines = {};

        lines.getLines = function () {

            return new Promise(function(resolve, reject) {

                var resource = $resource(path);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };

        return lines;
    }]);

})();