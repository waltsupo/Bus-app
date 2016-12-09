(function () {

    var app = angular.module('Bus-app');

    app.factory('Paths', function (Utils) {

        var path = "http://api.publictransport.tampere.fi/prod/?request=route&user=TREBusInfo&pass=TREBusInfo2016&epsg_out=4326&epsg_in=4326";

        var paths = {};

        paths.getPath = function (start, end) {

            return Utils.getResponseArray(path + "&from=" + start.lng + "," + start.lat
                                               + "&to=" + end.lng + "," + end.lat);
        };

        return paths;
    });

})();
