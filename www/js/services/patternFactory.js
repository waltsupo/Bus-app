(function () {

    var app = angular.module('Bus-app');

    app.factory('Patterns', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var patterns = {};

        patterns.getPattern = function (url) {

            return new Promise(function(resolve, reject) {

                var resource = $resource(url);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };

        return patterns;
    }]);

})();
