(function () {

    var app = angular.module('Bus-app');

    app.service('Utils', function ($resource) {

        // Returns promise
        this.getResponse = function (url) {

            return new Promise(function(resolve, reject) {

                var resource = $resource(url);

                resource.get({}, function (res) {
                    resolve(res);
                }, function () {
                    reject();
                });
            });
        };
    });

})();
