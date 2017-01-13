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
        };

        this.drawWalkLine = function (points) {

            $rootScope.map.addPolyline({
                points: points,
                'color': '#000000',
                'width': 5,
                'geodesic': true
            });
        };

        this.drawStartPoint = function(point) {

            return new Promise(function(resolve, reject) {

                $rootScope.map.addCircle({
                    'center': point,
                    'radius': 25,
                    'strokeColor': '#000000',
                    'strokeWidth': 5,
                    'fillColor': '#000000',
                    'zIndex': '5'
                }, function(circle) {
                    resolve(circle);
                });
            });
        };

        this.drawEndPoint = function(point) {

            return new Promise(function(resolve, reject) {

                return $rootScope.map.addCircle({
                    'center': point,
                    'radius': 25,
                    'strokeColor': '#005500',
                    'strokeWidth': 5,
                    'fillColor': '#005500',
                    'zIndex': '5'
                }, function(circle) {
                    resolve(circle);
                });
            });
        };
    });

})();
