(function () {

    var app = angular.module('Bus-app', ['ionic', 'ngResource']);

    app.run(function ($ionicPlatform, $rootScope, $ionicSideMenuDelegate) {

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the
                // accessory bar above the keyboard for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing.
                // It stops the viewport from snapping when text inputs are
                // focused. Ionic handles this internally for a much nicer
                // keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // Watch sidemenu state, hide if closed
            $rootScope.$watch(function() {
                return $ionicSideMenuDelegate.getOpenRatio();
            }, function(newValue, oldValue) {
                $rootScope.hideLeft = (newValue == 0);
            });
        });
    });

    app.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html'
            })

            .state('app.routes', {
                url: '/routes',
                views: {
                    'content': {
                        templateUrl: 'templates/routes.html',
                        controller: 'routesCtrl',
                    }
                }
            })

            .state('app.timetables', {
                url: '/timetables',
                views: {
                    'content': {
                        templateUrl: 'templates/timetables.html',
                        controller: 'timetablesCtrl'
                    }
                }
            })

            .state('app.stop', {
                url: '/stop',
                views: {
                    'content': {
                        templateUrl: 'templates/stop.html',
                        controller: 'stopCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/timetables');
    });

})();
