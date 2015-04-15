 'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */




/*
angular.module('intelliBarApp').controller('LoginCtrl', function($scope){
    //spark.on('login') already happened
    sparkLogin(function(data) {
      spark.listDevices(function(err, devices){
        $scope.$apply(function () {
          console.log('API call completed on Login event:', devices);
          $scope.bars = devices
        }) 
      })
    })
  })
 */


angular.module('Authentication')
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
  
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }])


