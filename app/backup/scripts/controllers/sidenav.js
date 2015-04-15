'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp').controller('NavController', function($scope, $mdSidenav) {
	$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
	};
	
	// sidenav tab switching
	var selected = 0;
    
	$scope.icon = function() {
		if (selected == 0){
			return "expand-more"
		}
		else if (selected == 1) {
			return "expand-less"
		}
	}

	$scope.toggle = function(){
		var pages = document.querySelector('core-pages');

		if (selected == 0){
			selected = 1
		}
		else if (selected == 1){
			selected = 0
		}
		pages.selected = selected
	}

	// dummy data
	$scope.bars = [{name: 'bar1', status: 'connected'},{name: 'bar2', status: 'connected'}];


	// for scroll disable when sidenav is open
	$scope.bodyScroll = function (){
		if($mdSidenav('left').isOpen()){
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
		} 
		else{
			document.body.style.position = '';
		}		
	}

});



