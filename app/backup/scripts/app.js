'use strict';

/**
 * @ngdoc overview
 * @name intelliBarApp
 * @description
 * # intelliBarApp
 *
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
    'ngCookies'
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



.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }])


 .controller('MainCtrl', function ($scope, $rootScope) {
    spark.login({username: 'ryangittens@hotmail.com', password: 'killa321'});
 })
