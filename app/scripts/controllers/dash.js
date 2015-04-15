'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp')
  .controller('DashCtrl', ["$scope", "$rootScope", function ($scope, $rootScope) {

    /*
    * d3 graph configuration
    */         
    $scope.xAxisTickFormat = function(){
        return function(d){
            return d3.time.format('%x')(new Date(d));
        }
    };

    $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
            console.log('tooltip content');
            return  'Super New Tooltip' +
                    '<h1>' + key + '</h1>' +
                    '<p>' +  y + ' at ' + x + '</p>'
        }
    };
     
 }])
