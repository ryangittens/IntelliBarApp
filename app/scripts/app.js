'use strict';

/**
 * @ngdoc overview
 * @name intelliBarApp
 * @description
 * # intelliBarApp
 *, 
 * Main module of the application.
 */

angular.module('Authentication', []);


angular
  .module('intelliBarApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'Authentication',
    'ngCookies',
    'ngStorage',
    'ngMessages',
    'ngMaterial',
    'nvd3ChartDirectives'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dash', {
        templateUrl: 'views/dash.html',
        controller: 'DashCtrl'
      })
      .when('/outlets', {
        templateUrl: 'views/outlets.html',
        controller: 'OutletsCtrl'
      })
      .when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html',
            hideMenus: true
        })  
        .otherwise({ redirectTo: '/login' });
  }])

  /*
  * Angular Material Theming
  */
  .config(["$mdThemingProvider", function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange');
  }])


.run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService', '$route',
    function ($rootScope, $location, $cookieStore, $http, AuthenticationService, $route) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            spark.login({accessToken: $rootScope.globals.currentUser.token});
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }])

/*
* AngularJS decimal filter
*/
.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});


//1) added token to response in auth.jshint
//2) added response.token to argument in login.js controller
//3) added token to arguments in service.setcredentials in auth.jshint
//4) added token to rootscope.globals currentUser object in service.setcredentials in auth.js
//5) added spark.login accessToken using $rootScope.globals.currentUser.token to auth