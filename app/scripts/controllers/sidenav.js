'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp')
.controller('NavController', ["$scope", "$mdSidenav", "$location", "$rootScope", "$route", "$mdDialog", function ($scope, $mdSidenav, $location, $rootScope, $route, $mdDialog) {

	$scope.tapHandler = function() {
		document.getElementById('modal').toggle();
		console.log('got here')
	}


	$scope.toggleLeftMenu = function() {
			$mdSidenav('left').toggle();
	};

	$scope.openLeftMenu = function() {
			$mdSidenav('left').open();
	};

	$scope.closeLeftMenu = function() {
			$mdSidenav('left').close();
	};

	
	// sidenav tab switching
	$scope.selected = 1;
    
	$scope.icon = function() {
		if ($scope.selected == 1){
			return "icon-expand-more"
		}
		else if ($scope.selected == 0) {
			return "icon-expand-less"
		}
	}

	$scope.toggle = function(){
		$scope.selected = !$scope.selected;
	}


	// for scroll disable when sidenav is open
	$scope.bodyScroll = function (){
		if($mdSidenav('left').isOpen()){
			document.body.style.position = 'fixed';
		} 
		else{
			document.body.style.position = 'relative';
		}		
	}

	// function to hide the toolbar/navbar on login screen
	$scope.isActive = function(viewLocation) {
          return viewLocation === $location.path();
      }

    $scope.statusIcon = function(stat){
    	if (stat == true) return 'icon-radio-button-on md-primary-color'

    	else return 'icon-radio-button-off'
    }


    //$rootScope.reload = function($routeProvider){
    	//$scope.$digest();
    	//console.log('Page Reloaded');
    //} 

	$scope.showModal= function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'views/connect.html',
	      targetEvent: ev,
	    })
	    $scope.closeLeftMenu();
	};
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};

}]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}



