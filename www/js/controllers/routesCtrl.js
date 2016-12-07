(function() {

    var app = angular.module('Bus-app');

    app.controller('routesCtrl', function ($scope, $rootScope) {

        var mapOpen = false;

        $scope.openMap = function() {

            if (mapOpen) {
                mapOpen = false;
                document.getElementById("map_canvas2").style.height="30%";
                //document.getElementById("stops").style.top="37%";
            } else {
                mapOpen = true;
                document.getElementById("map_canvas2").style.height="100%";
                //document.getElementById("stops").style.top="100%";
            }
        };

        $scope.$on("$ionicView.enter", function(event, data) {

            $rootScope.map.setDiv(document.getElementById("map_canvas2"));
            $rootScope.map.clear();
        });
    })
})();