'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp')
  .controller('OutletsCtrl', ["$scope", "$filter", "$rootScope", function ($scope, $filter, $rootScope) {

    $scope.tabs = [{
            title: 'One',
            url: 'one.tpl.html'
        }, {
            title: 'Two',
            url: 'two.tpl.html'
        }, {
            title: 'Three',
            url: 'three.tpl.html'
        }, {
            title: 'Four',
            url: 'four.tpl.html'
    }];

    $scope.currentTab = 'one.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    


    /*
    * d3 graph configuration
    */
    $scope.xAxisTickFormat = function(){
        return function(d){
            return d3.time.format('%X')(new Date(d));
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


 
}]);

