 'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */





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
