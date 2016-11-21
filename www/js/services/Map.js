(function () {

    var app = angular.module('Bus-app');

    app.service('Map', function () {


        this.drawStop = function (map, position) {

            map.addCircle({
                'center': position,
                'radius': 25,
                'strokeColor': '#00b300',
                'strokeWidth': 5,
                'fillColor': '#00b300',
                'zIndex': '5'
            });
        };

        this.drawLine = function (map, points) {

            map.addPolyline({
                points: points,
                'color': '#0059b3',
                'width': 5,
                'geodesic': true
            });
        }
    });

})();
