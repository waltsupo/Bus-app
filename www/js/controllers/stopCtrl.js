(function() {

    var app = angular.module('Bus-app');

    app.controller('stopCtrl', function ($scope, $rootScope) {

        $scope.name = $rootScope.stop.name + " (" + $rootScope.stop.shortName + ")";
    })
})();