'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp')
  .controller('DashCtrl', function ($scope, $rootScope) {

      //spark.on('login') already happened
      spark.listDevices(function(err, devices){
        $scope.$apply(function () {
          console.log('API call completed on Login event:', devices);
          $scope.bars = devices
        }) 
      })
 });
  
 