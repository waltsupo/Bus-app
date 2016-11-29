(function() {

    var app = angular.module('Bus-app');

    app.controller('stopCtrl', function ($scope, $rootScope) {

        var openMenu = 0;

        $scope.isOpen = function(number) {

            if (number == openMenu) {
                return true;
            }

            return false;
        };

        $scope.openMenu = function(number) {

            openMenu = number;
        };

        $scope.name = $rootScope.stop.name + " (" + $rootScope.stop.shortName + ")";
    })
})();