(function () {

  var app = angular.module('Bus-app');

  app.factory('Journeys', ["$resource", function($resource) {

    var path = "http://data.itsfactory.fi/journeys/api/1/journey-patterns";

    var journeys = {};

    journeys.getJourneys = function (callback) {

      var resource = $resource(path);

      resource.get({}, function (res) {
        callback(res);
      }, function() {
        callback(null)
      });
    };

    return journeys;
  }]);

})();
