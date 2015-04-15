'use strict';

/**
 * @ngdoc function
 * @name intelliBarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intelliBarApp
 */
angular.module('intelliBarApp')
  .controller('SparkCtrl', ["$scope", "$rootScope", "$timeout", "$location", "$interval", "$mdToast", function ($scope, $rootScope, $timeout, $location, $interval, $mdToast) {

  	/*
  	* Minues a day. Used to select the number of rows to add to get sum of energy for the given timeframe
  	*/
    $scope.day = 1440;
    $scope.month = 43200;
    $scope.hr = 60;

    /*
    * Sets the selected bar as the active bar
    */
  	$rootScope.setBar = function(barIndex){
  		if(barIndex != null){
		  		if(barIndex != $rootScope.selectedBar){
		  			$rootScope.selectedBar = barIndex;
			  		loadBars(barIndex);
			  	}
			  	else if (barIndex == $rootScope.selectedBar){
			  		console.log('selected bar = selected')
			  		$mdToast.show($mdToast.simple().content('Already selected').position('top right'));
			  	}
		}
				else{
					$rootScope.selectedBar = 0;
				}
  	}
 
  	/*
    * Loads the data from the active/selected bar
    */
  	var loadBars = function(barIndex){
  		//only show data loading on first load
  		if(!$rootScope.bars){
  			$scope.dataLoading = true;
  		}	
  		
  		var devicesPr = spark.listDevices();
		devicesPr.then(
		  function(data){
		    //*console.log('Core attrs retrieved successfully:', data);
		    var bars = data;
		    //check if bars is already loaded so entire bars object would not be loaded again if it was already loaded
		    if(!$rootScope.bars){
				$rootScope.bars = bars;
			}

			if(barIndex){
				loadBarObj(barIndex);
			}
			else{
				$rootScope.selectedBar = 0;
				loadBarObj(0);
				}
		  },
		  function(err) {
		  	$scope.dataLoading = false;
		    console.log('Load bars ', err);
		    $scope.$digest();
		    loadBars($rootScope.selectedBar);
		    $rootScope.bars[barIndex].connected = false;
		  }
		);

  	};


  	/*
    * Loads the object for the active bar
    */
  	var loadBarObj = function(barIndex){
  			//*console.log($rootScope.bars[barIndex].connected);
  			if($rootScope.bars[barIndex].connected == true){
  				//*console.log('relay ' + barIndex)
  				loadRelayAlias(barIndex);
			  	loadRelayStatus(barIndex);
			  	$rootScope.loadData();
			}
			else {
				$scope.dataLoading = false;
				$scope.$digest();
				$rootScope.bars[barIndex].connected = false;
			}
  	}

  	/*
    * Loads the relay status
    */
  	var loadRelayStatus = function(i){
  		//initalize only once
  		if($rootScope.bars[i].relayStatus == undefined){
  			$rootScope.bars[i].relayStatus = [0,0,0,0];
  		}

  		$rootScope.bars[i].getVariable('BarObject', function(err, data) {
				  if (err) {
				  	$scope.dataLoading = false;
				    console.log('Load relay status', err);
				    // load bars again if there is an error. The load bar function checks the connectivity
				    loadBars($rootScope.selectedBar);
				  } else {
				    	//*console.log('Core attr retrieved successfully:', data);
				    	// parse the BarObject data from the spark core and turn the 1 into true and 0 into false
				    	// only parses from 0 to 3
				    	for(var j = 0; j < 4; j++){
					    	if(data.result.charAt(j) == '1'){
					    		$rootScope.bars[i].relayStatus[j]=true;
					    	}
					    	else{
					    		$rootScope.bars[i].relayStatus[j]=false;
					    	}
						}
						$scope.$digest(); 
						$scope.dataLoading = false;   	
					} 
				})		    
	}
		
	/*
    * Loads the alias of the specific relay that the user sets. 
    * There are 9 built in options for the user to set each corresponding to a device
    * in $rootScope.devices
    */
  	var loadRelayAlias = function(i){
  		 $rootScope.bars[i].getVariable('BarObject', function(err, data) {
				  if (err) {
				  	$scope.$digest();
				    console.log('Load relay alias', err);
				    loadBars($rootScope.selectedBar);
				  } else {
				    	//*console.log('Core attr retrieved successfully:', data);
				    			//initalize only once
				    	  		if(!$rootScope.bars[i].relayAlias){
				    	  			$rootScope.bars[i].relayAlias = [0,0,0,0];
				    	  		}
				    	  		// Parses the BarObject, positions 4 to 8 to get relay aliases
							    for(var j = 4; j < 8; j++){
							    	$rootScope.bars[i].relayAlias[j - 4] = data.result.charAt(j);
								}
								$rootScope.loadDeviceAlias();
								
								//*console.log($rootScope.bars[i].relayAlias)
								$scope.$digest();
								$scope.dataLoading = false;   	
					} 
				})
  	}

  	/*
    * Updates the Relay Aliases on the spark core when the user clicks save
    */
  	$rootScope.updateAlias = function(aliasStr, deviceID){
	var accessToken = $rootScope.globals.currentUser.token;
	var setFunc = "updateAlias"; 
    var requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + setFunc + "/";
    $.post( requestURL, { params: aliasStr, access_token: accessToken }); 		
	}


  	/*****************************************************************/

    $rootScope.devices = ['radio', 'outlet', 'computer', 'light', 'printer','tv', 'audio', 'dvr', 'console', 'other'];
    
    /*
    * Updates the Relay Aliases in the application
    */
  	$rootScope.loadDeviceAlias = function(){
  		//initalize only once
  		if(!$rootScope.device){
  			$rootScope.device = [];
    		$rootScope.deviceN = [];
  		}
	    for(var i = 0; i < 4; i++){
	        $scope.device[i] = $scope.devices[$rootScope.bars[$rootScope.selectedBar].relayAlias[i]];
	    }
	    $scope.$digest();
	};

	// convert the alias to numeric codes 1-9
	$rootScope.updateDeviceAlias = function(){
	    for(var i = 0; i < 4; i++){
	        for(var j = 0; j < 10; j++){
	            if($rootScope.device[i] == $rootScope.devices[j]){
	                $rootScope.deviceN[i] = j;
	            }
	        }     
	    }
	    console.log($scope.deviceN);
	    var aliasStr = $scope.deviceN.toString();
	    console.log(aliasStr)
	    $rootScope.updateAlias(aliasStr, $rootScope.bars[$rootScope.selectedBar].id);
	}

  	/***************************************************************************/   

	    /*
	    * google spreadsheet api call
	    */         
        $rootScope.loadData = function(){
        	if($rootScope.bars[$rootScope.selectedBar]){
	        	if($rootScope.bars[$rootScope.selectedBar].connected == true){
	        		//initalize instantaneous data
	        		$scope.loadInst();
		            var urlLocation = '1r_9-k7vnt_JoKbTpHGYy7Wk_eFSBMGs8z5PQ8dlpZTo'; //put the spreadsheet key here
		            var url = 'https://spreadsheets.google.com/feeds/cells/' + urlLocation + '/od6/public/values?alt=json-in-script&callback=?';
		            // saves the data from spreadsheet in scope to be used in the d3 graphs
		            $.getJSON(url, function(data) {
		                $scope.data1 = [{"key": "outlet 1", "values": mapEntries(data,2)}];	                
		                $scope.data2 = [{"key": "outlet 2", "values": mapEntries(data,3)}];
		                $scope.data3 = [{"key": "outlet 3", "values": mapEntries(data,4)}];
		                $scope.data4 = [{"key": "outlet 4", "values": mapEntries(data,5)}];
		                // formatted for d3 compound graph
		                $scope.datat = [{"key": "outlet 1", "values": mapEntries(data,2)},{"key": "outlet 2", "values": mapEntries(data,3)},{"key": "outlet 3", "values": mapEntries(data,4)},{"key": "outlet 4", "values": mapEntries(data,5)}];
		            }); 
		            $scope.$digest();
	            }
	        }            
        }
        
       /*
       * sums the last n amount of readings. 
       * the gain is used to multiply the values by a given amount to convert units
       */
       $scope.sumData = function(data, n, gain){
	       	if(data){
	       		if(!gain){
	       			gain = 1;
	       		}
	       		var sum = 0;
	       		var j = data[0].values.length;
	       		// if n is greater than the length of array set n = length of array
	       		if(n > j){
	       			n = j;
	       		}
	       		//sum from last downwards
	        	for (var i = 0; i < n; i++){
	        		sum += data[0].values[j - 1][1] * gain;
	        		j--;
	        	}
	        	return sum
	        }
	        else{
	        	return '...'
	        }
        }

   /*************************************************************************************/
 	
 	/*
 	* Function to switch the outlets
 	*/
	$scope.outletSwitch = function(outn,newValue,deviceID){
		var accessToken = $rootScope.globals.currentUser.token;
		var setFunc = "relay";
	  	var paramStr = "r" + outn.toString();
	        if (newValue==true) { 
	           paramStr = paramStr + ",HIGH";
	        } else {
	          paramStr = paramStr + ",LOW";
	        }
	        var requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + setFunc + "/";
	        $.post( requestURL, { params: paramStr, access_token: accessToken });

	}

	/*
	* Function to check the status of the active bar. Did it turn off or on.
	*/
  	$scope.checkStatus = function(){
  		
  		if(!$scope.requestInProg){
	  		if($rootScope.bars[$rootScope.selectedBar]){
	  			//console.log('status check')
	  			if(!$scope.data1){
	  				$rootScope.loadData();
	  			}
		  		var devicesPr = spark.listDevices();
		  		$scope.requestInProg = true;
				devicesPr.then(
				  function(data){
				  	$scope.requestInProg = false;
				    //console.log('Core attrs retrieved successfully:', data);
				    var bars = data;
				    // if the status changes, loadSpark				   
					    if(bars[$rootScope.selectedBar].connected != $rootScope.bars[$rootScope.selectedBar].connected){
					    	//console.log('got here')
					    	$rootScope.bars[$rootScope.selectedBar].connected = bars[$rootScope.selectedBar].connected;
					    	$scope.dataLoading = true;
					    	$rootScope.loadSpark();
					    }
		
				  },
				  function(err) {
				  	//$scope.err = true;
				  	//$rootScope.bars[$rootScope.selectedBar] = false;
				  	$scope.requestInProg = false;
				    console.log('check status: ', err);
				    $scope.$digest();
				    $rootScope.loadSpark();
				  }
				);
			}
			else{
				$rootScope.loadSpark();
			}
		}
  	}

  		/*
  		* Function to load the instantaneous power data from the spark core
  		*/
  	  	$scope.loadInst = function(){
  	  		//*console.log('inst load')
  	  		// prevent multiple calls occurring at the same time
  	  		if(!$scope.requestInProg){
	  	  		if($rootScope.bars[$rootScope.selectedBar]){
		  	  		if($rootScope.bars[$rootScope.selectedBar].connected == true){
		  	  			$scope.requestInProg = true;
		  	  			//initalize only once so data wont be cleared on every call
		  	  			if (!$rootScope.bars[$rootScope.selectedBar].inst) {
		  	  				$rootScope.bars[$rootScope.selectedBar].inst = {};
		  	  			};
		  		 		$rootScope.bars[$rootScope.selectedBar].getVariable('power', function(err, data) {
						  if (err) {
						  	//$scope.err = true;
						  	$scope.$digest();
						  	//$rootScope.bars[$rootScope.selectedBar].connected = false;
						  	$scope.requestInProg = false;
						    console.log('Loading bars:', err);
						    loadBars($rootScope.selectedBar);
						  } else {
						    	//*console.log('Core attr retrieved successfully:', data);
						    			$rootScope.bars[$rootScope.selectedBar].inst = JSON.parse(data.result);
						    			
						    			//.inst is formatted bars[selectedBar].inst.data data1 refers to outlet 1
						    			$scope.totalPower = $rootScope.bars[$rootScope.selectedBar].inst.data1 + $rootScope.bars[$rootScope.selectedBar].inst.data2 + $rootScope.bars[$rootScope.selectedBar].inst.data3 + $rootScope.bars[$rootScope.selectedBar].inst.data4;
					    				//console.log($scope.inst)
										$scope.$digest();
										$scope.requestInProg = false;  	
							} 
						})
					}
				}
			}
  		};
 

  	/*
  	* function to load all the components of the app
  	*/ 
  	$rootScope.loadSpark = function(){
  		loadBars($rootScope.selectedBar);
  				  // Kick off the interval
		  $scope.intervalFunction();
		  // Kick off the interval
		  $scope.intervalFunction2();
		  $scope.intervalFunction3();
		  // Trigger srtBar function
  			$rootScope.setBar(null);
  	}

  	  // Function to update data every minute
		  $scope.intervalFunction = function(){
		    $timeout(function() {
		      $rootScope.loadData();		      
		      $scope.intervalFunction();
		    }, 60000)
		  };

		  

		  // Function to check status every 10secs
		  $scope.intervalFunction2 = function(){
		    $timeout(function() {
		      $scope.checkStatus();
		      $scope.intervalFunction2();
		    }, 10000)
		  };

		  // Function to read instantaneous value every 12secs
		  $scope.intervalFunction3 = function(){
		    $timeout(function() {
		      $scope.loadInst();
		      $scope.intervalFunction3();
		    }, 12000)
		  };

 }])
