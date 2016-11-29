(function () {

    var app = angular.module('Bus-app');

    app.service('Map', function ($rootScope) {


        this.drawStop = function (position) {

            $rootScope.map.addCircle({
                'center': position,
                'radius': 25,
                'strokeColor': '#00b300',
                'strokeWidth': 5,
                'fillColor': '#00b300',
                'zIndex': '5'
            });
        };

        this.drawSelectedStop = function(position) {

            $rootScope.map.addCircle({
                'center': position,
                'radius': 25,
                'strokeColor': '#000000',
                'strokeWidth': 5,
                'fillColor': '#000000',
                'zIndex': '5'
            });
        };

        this.drawLine = function (points) {

            $rootScope.map.addPolyline({
                points: points,
                'color': '#0059b3',
                'width': 5,
                'geodesic': true
            });
        }
    });

})();
