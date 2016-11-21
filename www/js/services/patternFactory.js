(function () {

    var app = angular.module('Bus-app');

    app.factory('Patterns', ["$resource", function ($resource) {

        var path = "http://data.itsfactory.fi/journeys/api/1/routes";

        var patterns = {};

        patterns.getPattern = function (url, callback) {

            var resource = $resource(url);

            resource.get({}, function (res) {
                callback(res);
            }, function () {
                callback(null);
            });
        };

        return patterns;
    }]);

})();
